// Types per il sistema di gestione magazzino

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'docente' | 'assistente'
}

export interface Laboratorio {
  id: string
  nome: string
  tipo: 'estetica' | 'acconciatura' | 'ristorazione' | 'altro'
  responsabile: string
  attivo: boolean
  createdAt: Date
}

export interface Prodotto {
  id: string
  barcode?: string
  nome: string
  descrizione?: string
  categoria: string
  unitaMisura: string
  prezzoUnitario?: number
  fornitore?: string
  scadenza?: Date
  lotto?: string
  createdAt: Date
  updatedAt: Date
}

export interface MovimentoMagazzino {
  id: string
  tipo: 'carico' | 'scarico' | 'trasferimento' | 'inventario'
  prodottoId: string
  laboratorioId: string
  laboratorioDestinazioneId?: string // Solo per trasferimenti
  quantita: number
  quantitaPrecedente?: number
  note?: string
  userId: string
  userName: string
  bollaId?: string
  createdAt: Date
}

export interface Giacenza {
  prodottoId: string
  laboratorioId: string
  quantita: number
  quantitaMinima?: number
  posizione?: string
  updatedAt: Date
}

export interface BollaAccompagnamento {
  id: string
  numero?: string
  fornitore: string
  dataConsegna: Date
  fileUrl?: string
  fileName?: string
  movimenti: string[] // Array di movimentoId
  userId: string
  userName: string
  createdAt: Date
}

export interface ScanResult {
  barcode: string
  format: string
}

// Props per i componenti
export interface DashboardStats {
  totaleMovimenti: number
  totaleProdotti: number
  movimentiOggi: number
  prodottiBassaGiacenza: number
}

export interface MovimentoFormData {
  tipo: MovimentoMagazzino['tipo']
  prodottoId: string
  laboratorioId: string
  laboratorioDestinazioneId?: string
  quantita: number
  note?: string
  bollaId?: string
}

export interface ProdottoFormData {
  barcode?: string
  nome: string
  descrizione?: string
  categoria: string
  unitaMisura: string
  prezzoUnitario?: number
  fornitore?: string
  scadenza?: Date
  lotto?: string
}

export interface InventarioItem {
  prodotto: Prodotto
  giacenzaAttuale: number
  quantitaInventario: number
  differenza: number
  note?: string
}