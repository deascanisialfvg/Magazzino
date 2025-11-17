import { CosmosClient, Database, Container } from '@azure/cosmos'
import {
  Prodotto,
  Laboratorio,
  MovimentoMagazzino,
  Giacenza,
  BollaAccompagnamento,
  DashboardStats
} from '../types'

class CosmosService {
  private client: CosmosClient | null = null
  private database: Database | null = null
  private containers: {
    prodotti?: Container
    laboratori?: Container
    movimenti?: Container
    giacenze?: Container
    bolle?: Container
  } = {}

  async initialize(endpoint: string, key: string) {
    try {
      this.client = new CosmosClient({ endpoint, key })
      
      // Crea database se non esiste
      const { database } = await this.client.databases.createIfNotExists({
        id: 'MagazzinoLaboratori'
      })
      this.database = database

      // Crea containers se non esistono
      await this.createContainers()
      
      console.log('Cosmos DB inizializzato con successo')
      return true
    } catch (error) {
      console.error('Errore inizializzazione Cosmos DB:', error)
      return false
    }
  }

  private async createContainers() {
    if (!this.database) throw new Error('Database non inizializzato')

    const containerConfigs = [
      { id: 'Prodotti', partitionKey: '/id' },
      { id: 'Laboratori', partitionKey: '/id' },
      { id: 'Movimenti', partitionKey: '/laboratorioId' },
      { id: 'Giacenze', partitionKey: '/laboratorioId' },
      { id: 'Bolle', partitionKey: '/id' }
    ]

    for (const config of containerConfigs) {
      const { container } = await this.database.containers.createIfNotExists(config)
      
      switch (config.id) {
        case 'Prodotti':
          this.containers.prodotti = container
          break
        case 'Laboratori':
          this.containers.laboratori = container
          break
        case 'Movimenti':
          this.containers.movimenti = container
          break
        case 'Giacenze':
          this.containers.giacenze = container
          break
        case 'Bolle':
          this.containers.bolle = container
          break
      }
    }
  }

  // PRODOTTI
  async getProdotti(): Promise<Prodotto[]> {
    if (!this.containers.prodotti) throw new Error('Container prodotti non disponibile')
    
    const { resources } = await this.containers.prodotti.items
      .query('SELECT * FROM c ORDER BY c.nome ASC')
      .fetchAll()
    
    return resources
  }

  async getProdottoById(id: string): Promise<Prodotto | null> {
    if (!this.containers.prodotti) throw new Error('Container prodotti non disponibile')
    
    try {
      const { resource } = await this.containers.prodotti.item(id, id).read()
      return resource || null
    } catch {
      return null
    }
  }

  async getProdottoByBarcode(barcode: string): Promise<Prodotto | null> {
    if (!this.containers.prodotti) throw new Error('Container prodotti non disponibile')
    
    const { resources } = await this.containers.prodotti.items
      .query({
        query: 'SELECT * FROM c WHERE c.barcode = @barcode',
        parameters: [{ name: '@barcode', value: barcode }]
      })
      .fetchAll()
    
    return resources[0] || null
  }

  async createProdotto(prodotto: Omit<Prodotto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prodotto> {
    if (!this.containers.prodotti) throw new Error('Container prodotti non disponibile')
    
    const newProdotto: Prodotto = {
      ...prodotto,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const { resource } = await this.containers.prodotti.items.create(newProdotto)
    return resource!
  }

  async updateProdotto(id: string, updates: Partial<Prodotto>): Promise<Prodotto> {
    if (!this.containers.prodotti) throw new Error('Container prodotti non disponibile')
    
    const prodotto = await this.getProdottoById(id)
    if (!prodotto) throw new Error('Prodotto non trovato')

    const updatedProdotto = {
      ...prodotto,
      ...updates,
      updatedAt: new Date()
    }

    const { resource } = await this.containers.prodotti.item(id, id).replace(updatedProdotto)
    return resource!
  }

  // LABORATORI
  async getLaboratori(): Promise<Laboratorio[]> {
    if (!this.containers.laboratori) throw new Error('Container laboratori non disponibile')
    
    const { resources } = await this.containers.laboratori.items
      .query('SELECT * FROM c WHERE c.attivo = true ORDER BY c.nome ASC')
      .fetchAll()
    
    return resources
  }

  async createLaboratorio(laboratorio: Omit<Laboratorio, 'id' | 'createdAt'>): Promise<Laboratorio> {
    if (!this.containers.laboratori) throw new Error('Container laboratori non disponibile')
    
    const newLaboratorio: Laboratorio = {
      ...laboratorio,
      id: this.generateId(),
      createdAt: new Date()
    }

    const { resource } = await this.containers.laboratori.items.create(newLaboratorio)
    return resource!
  }

  // MOVIMENTI
  async getMovimenti(laboratorioId?: string, limit = 100): Promise<MovimentoMagazzino[]> {
    if (!this.containers.movimenti) throw new Error('Container movimenti non disponibile')
    
    let query = 'SELECT * FROM c ORDER BY c.createdAt DESC'
    const parameters: any[] = []

    if (laboratorioId) {
      query = 'SELECT * FROM c WHERE c.laboratorioId = @laboratorioId ORDER BY c.createdAt DESC'
      parameters.push({ name: '@laboratorioId', value: laboratorioId })
    }

    const { resources } = await this.containers.movimenti.items
      .query({ query, parameters })
      .fetchAll()
    
    return resources.slice(0, limit)
  }

  async createMovimento(movimento: Omit<MovimentoMagazzino, 'id' | 'createdAt'>): Promise<MovimentoMagazzino> {
    if (!this.containers.movimenti) throw new Error('Container movimenti non disponibile')
    
    const newMovimento: MovimentoMagazzino = {
      ...movimento,
      id: this.generateId(),
      createdAt: new Date()
    }

    // Aggiorna giacenza
    await this.updateGiacenza(
      movimento.prodottoId,
      movimento.laboratorioId,
      movimento.quantita,
      movimento.tipo
    )

    // Se è un trasferimento, aggiorna anche il laboratorio di destinazione
    if (movimento.tipo === 'trasferimento' && movimento.laboratorioDestinazioneId) {
      await this.updateGiacenza(
        movimento.prodottoId,
        movimento.laboratorioDestinazioneId,
        movimento.quantita,
        'carico'
      )
    }

    const { resource } = await this.containers.movimenti.items.create(newMovimento)
    return resource!
  }

  // GIACENZE
  async getGiacenze(laboratorioId?: string): Promise<Giacenza[]> {
    if (!this.containers.giacenze) throw new Error('Container giacenze non disponibile')
    
    let query = 'SELECT * FROM c'
    const parameters: any[] = []

    if (laboratorioId) {
      query = 'SELECT * FROM c WHERE c.laboratorioId = @laboratorioId'
      parameters.push({ name: '@laboratorioId', value: laboratorioId })
    }

    const { resources } = await this.containers.giacenze.items
      .query({ query, parameters })
      .fetchAll()
    
    return resources
  }

  async getGiacenza(prodottoId: string, laboratorioId: string): Promise<Giacenza | null> {
    if (!this.containers.giacenze) throw new Error('Container giacenze non disponibile')
    
    const { resources } = await this.containers.giacenze.items
      .query({
        query: 'SELECT * FROM c WHERE c.prodottoId = @prodottoId AND c.laboratorioId = @laboratorioId',
        parameters: [
          { name: '@prodottoId', value: prodottoId },
          { name: '@laboratorioId', value: laboratorioId }
        ]
      })
      .fetchAll()
    
    return resources[0] || null
  }

  private async updateGiacenza(prodottoId: string, laboratorioId: string, quantita: number, tipo: string) {
    const giacenza = await this.getGiacenza(prodottoId, laboratorioId)
    
    let nuovaQuantita = 0
    
    if (giacenza) {
      switch (tipo) {
        case 'carico':
          nuovaQuantita = giacenza.quantita + quantita
          break
        case 'scarico':
        case 'trasferimento':
          nuovaQuantita = Math.max(0, giacenza.quantita - quantita)
          break
        case 'inventario':
          nuovaQuantita = quantita
          break
      }

      const updatedGiacenza = {
        ...giacenza,
        quantita: nuovaQuantita,
        updatedAt: new Date()
      }

      await this.containers.giacenze!.item(`${prodottoId}_${laboratorioId}`, laboratorioId)
        .replace(updatedGiacenza)
    } else if (tipo === 'carico' || tipo === 'inventario') {
      const newGiacenza: Giacenza = {
        prodottoId,
        laboratorioId,
        quantita: tipo === 'carico' ? quantita : quantita,
        updatedAt: new Date()
      }

      await this.containers.giacenze!.items.create({
        ...newGiacenza,
        id: `${prodottoId}_${laboratorioId}`
      })
    }
  }

  // DASHBOARD STATS
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [movimenti, prodotti, movimentiOggi, giacenze] = await Promise.all([
      this.getMovimenti(),
      this.getProdotti(),
      this.getMovimentiOggi(today),
      this.getGiacenze()
    ])

    const prodottiBassaGiacenza = giacenze.filter(g => 
      g.quantitaMinima && g.quantita <= g.quantitaMinima
    ).length

    return {
      totaleMovimenti: movimenti.length,
      totaleProdotti: prodotti.length,
      movimentiOggi: movimentiOggi.length,
      prodottiBassaGiacenza
    }
  }

  private async getMovimentiOggi(today: Date): Promise<MovimentoMagazzino[]> {
    if (!this.containers.movimenti) return []
    
    const { resources } = await this.containers.movimenti.items
      .query({
        query: 'SELECT * FROM c WHERE c.createdAt >= @today',
        parameters: [{ name: '@today', value: today.toISOString() }]
      })
      .fetchAll()
    
    return resources
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

export const cosmosService = new CosmosService()