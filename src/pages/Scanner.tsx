import React, { useState, useRef } from 'react'
import { Camera, X, CheckCircle } from 'lucide-react'

const Scanner: React.FC = () => {
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Camera posteriore su mobile
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setScanning(true)
      }
    } catch (error) {
      console.error('Errore accesso camera:', error)
      alert('Impossibile accedere alla camera. Verifica i permessi.')
    }
  }

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setScanning(false)
  }

  const handleManualInput = (barcode: string) => {
    if (barcode.trim()) {
      setLastScan(barcode.trim())
      // Qui aggiungeremo la logica per cercare il prodotto
      console.log('Barcode inserito:', barcode)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Scanner Barcode</h1>
        <p className="text-gray-600">Scansiona o inserisci il barcode per trovare un prodotto</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Camera Section */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Scansione Camera</h3>
          
          {!scanning ? (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Utilizza la camera per scansionare i barcode</p>
              <button
                onClick={startScanning}
                className="btn btn-primary"
              >
                <Camera className="w-4 h-4 mr-2" />
                Avvia Scanner
              </button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-gray-900"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-24 border-2 border-primary-500 rounded-lg bg-transparent" />
              </div>
              <button
                onClick={stopScanning}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Manual Input Section */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Inserimento Manuale</h3>
          <div className="space-y-4">
            <input
              type="text"
              className="form-input"
              placeholder="Inserisci il barcode..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualInput(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Inserisci il barcode e premi Invio
            </p>
          </div>
        </div>

        {/* Last Scan Result */}
        {lastScan && (
          <div className="card bg-success-50 border-success-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
              <div>
                <p className="text-success-800 font-medium">Ultimo barcode scansionato:</p>
                <p className="text-success-700 font-mono text-sm">{lastScan}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-success-200">
              <button className="btn btn-success w-full">
                Cerca Prodotto
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-2">Istruzioni:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Assicurati di avere buona illuminazione</li>
            <li>• Tieni il barcode stabile nel riquadro</li>
            <li>• Se la scansione non funziona, usa l'inserimento manuale</li>
            <li>• Su mobile, ruota in verticale per migliori risultati</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Scanner