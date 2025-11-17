import React from 'react'
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react'

const Dashboard: React.FC = () => {
  // Mock data - sarà sostituito con dati reali da Cosmos DB
  const stats = {
    totaleProdotti: 156,
    totaleMovimenti: 1247,
    movimentiOggi: 8,
    prodottiBassaGiacenza: 12
  }

  const recentMovements = [
    { id: 1, prodotto: 'Shampoo Professionale', tipo: 'carico', quantita: 10, laboratorio: 'Acconciatura', user: 'Mario Rossi', time: '2 ore fa' },
    { id: 2, prodotto: 'Crema Viso Anti-età', tipo: 'scarico', quantita: 2, laboratorio: 'Estetica', user: 'Laura Bianchi', time: '3 ore fa' },
    { id: 3, prodotto: 'Farina Tipo 00', tipo: 'trasferimento', quantita: 5, laboratorio: 'Ristorazione', user: 'Giuseppe Verdi', time: '5 ore fa' }
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Panoramica generale del magazzino laboratori</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Prodotti Totali</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totaleProdotti}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Movimenti Totali</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totaleMovimenti}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Oggi</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.movimentiOggi}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-danger-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Scorte Basse</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.prodottiBassaGiacenza}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="card">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Movimenti Recenti</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentMovements.map((movement, idx) => (
                <li key={movement.id}>
                  <div className="relative pb-8">
                    {idx !== recentMovements.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          movement.tipo === 'carico' ? 'bg-success-500' :
                          movement.tipo === 'scarico' ? 'bg-danger-500' :
                          'bg-warning-500'
                        }`}>
                          <Activity className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{movement.prodotto}</span>
                            {' - '}
                            <span className={`capitalize ${
                              movement.tipo === 'carico' ? 'text-success-600' :
                              movement.tipo === 'scarico' ? 'text-danger-600' :
                              'text-warning-600'
                            }`}>
                              {movement.tipo}
                            </span>
                            {' di '}
                            <span className="font-medium">{movement.quantita}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {movement.laboratorio} - {movement.user}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time>{movement.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard