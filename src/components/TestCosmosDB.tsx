import React, { useState, useEffect } from 'react'
import { cosmosService } from '../services/cosmosService'

const TestCosmosDB: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus('loading')
      setMessage('Connessione a Cosmos DB...')

      const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT
      const key = import.meta.env.VITE_COSMOS_KEY

      if (!endpoint || !key) {
        throw new Error('Credenziali Cosmos DB mancanti')
      }

      // Inizializza Cosmos DB
      const success = await cosmosService.initialize(endpoint, key)
      
      if (success) {
        setStatus('success')
        setMessage('✅ Cosmos DB collegato con successo!')
      } else {
        throw new Error('Inizializzazione fallita')
      }
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Errore: ${error instanceof Error ? error.message : 'Connessione fallita'}`)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Cosmos DB</h2>
      
      <div className={`p-4 rounded-md ${
        status === 'loading' ? 'bg-blue-50 text-blue-800' :
        status === 'success' ? 'bg-green-50 text-green-800' :
        'bg-red-50 text-red-800'
      }`}>
        {status === 'loading' && (
          <div className="flex items-center">
            <div className="spinner mr-3"></div>
            {message}
          </div>
        )}
        {status !== 'loading' && <p>{message}</p>}
      </div>

      {status !== 'loading' && (
        <button
          onClick={testConnection}
          className="mt-4 btn btn-primary w-full"
        >
          Riprova connessione
        </button>
      )}
    </div>
  )
}

export default TestCosmosDB