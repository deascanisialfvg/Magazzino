import React from 'react'

interface LoginProps {
  onLogin: () => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestione Magazzino
          </h1>
          <p className="text-gray-600">
            Sistema di gestione per laboratori scolastici
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-primary-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-primary-700 mb-2">
              Laboratori Supportati
            </h2>
            <div className="space-y-2 text-sm text-primary-600">
              <div>🎨 Estetica</div>
              <div>✂️ Acconciatura</div>
              <div>🍽️ Ristorazione</div>
              <div>📱 Scanner Barcode</div>
            </div>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="btn btn-primary w-full text-lg py-3"
        >
          Accedi con Microsoft 365
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Utilizza le tue credenziali scolastiche per accedere
        </p>
      </div>
    </div>
  )
}

export default Login