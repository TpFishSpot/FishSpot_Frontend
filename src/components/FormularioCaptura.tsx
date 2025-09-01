import React, { useState } from 'react'
import { X, Camera, Upload, Calendar, MapPin, Ruler, Weight, Fish, Target } from 'lucide-react'
import { useEspecies } from '../hooks/useEspecies'
import { useCarnadas } from '../hooks/useCarnadas'
import { useTiposPesca } from '../hooks/useTiposPesca'

interface NuevaCapturaData {
  especieId: string
  especieNombre: string
  fecha: string
  ubicacion: string
  peso?: number
  longitud?: number
  carnada: string
  tipoPesca: string
  foto?: File
  notas?: string
  clima?: string
  horaCaptura?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (captura: NuevaCapturaData) => void
}

const FormularioCaptura: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NuevaCapturaData>({
    especieId: '',
    especieNombre: '',
    fecha: new Date().toISOString().split('T')[0],
    ubicacion: '',
    carnada: '',
    tipoPesca: '',
    horaCaptura: new Date().toTimeString().slice(0, 5)
  })
  const [fotoPreview, setFotoPreview] = useState<string>('')

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies()
  const { carnadas, loading: loadingCarnadas, error: errorCarnadas } = useCarnadas()
  const { tiposPesca, loading: loadingTipos, error: errorTipos } = useTiposPesca()

  const isLoadingData = loadingEspecies || loadingCarnadas || loadingTipos
  const hasErrors = errorEspecies || errorCarnadas || errorTipos

  const carnadasPorTipo = carnadas.reduce((grupos, carnada) => {
    const tipo = carnada.tipoCarnada
    if (!grupos[tipo]) {
      grupos[tipo] = []
    }
    grupos[tipo].push(carnada)
    return grupos
  }, {} as Record<string, typeof carnadas>)

  const climas = [
    'Soleado',
    'Nublado',
    'Lluvioso',
    'Ventoso',
    'Tormentoso',
    'Neblina'
  ]

  const handleInputChange = (field: keyof NuevaCapturaData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'especieId') {
      const especie = especies.find(e => e.id === value)
      if (especie) {
        setFormData(prev => ({
          ...prev,
          especieNombre: especie.nombresComunes?.[0]?.nombre || especie.nombreCientifico
        }))
      }
    }
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, foto: file }))
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.especieId || !formData.ubicacion || !formData.carnada || !formData.tipoPesca) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    onSave(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      especieId: '',
      especieNombre: '',
      fecha: new Date().toISOString().split('T')[0],
      ubicacion: '',
      carnada: '',
      tipoPesca: '',
      horaCaptura: new Date().toTimeString().slice(0, 5)
    })
    setFotoPreview('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Fish className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Nueva Captura</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {isLoadingData && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando datos...</span>
              </div>
            </div>
          )}

          {hasErrors && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Error cargando datos</span>
              </div>
              <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                {errorEspecies || errorCarnadas || errorTipos}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Foto de la captura</span>
            </label>
            
            {fotoPreview ? (
              <div className="relative">
                <img 
                  src={fotoPreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFotoPreview('')
                    setFormData(prev => ({ ...prev, foto: undefined }))
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="w-full h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Haz clic para subir una foto
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Fish className="w-4 h-4" />
                <span>Especie *</span>
              </label>
              <select
                value={formData.especieId}
                onChange={(e) => handleInputChange('especieId', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
                disabled={loadingEspecies}
              >
                <option value="">
                  {loadingEspecies ? 'Cargando especies...' : 'Seleccionar especie'}
                </option>
                {especies.map(especie => (
                  <option key={especie.id} value={especie.id}>
                    {especie.nombresComunes?.[0]?.nombre || especie.nombreCientifico}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Tipo de Pesca *</span>
              </label>
              <select
                value={formData.tipoPesca}
                onChange={(e) => handleInputChange('tipoPesca', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
                disabled={loadingTipos}
              >
                <option value="">
                  {loadingTipos ? 'Cargando tipos de pesca...' : 'Seleccionar tipo'}
                </option>
                {tiposPesca.map(tipo => (
                  <option key={tipo.id} value={tipo.id} title={tipo.descripcion}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Fecha</span>
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Hora de captura
              </label>
              <input
                type="time"
                value={formData.horaCaptura || ''}
                onChange={(e) => handleInputChange('horaCaptura', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Weight className="w-4 h-4" />
                <span>Peso (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.peso || ''}
                onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="Ej: 2.5"
              />
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Ruler className="w-4 h-4" />
                <span>Longitud (cm)</span>
              </label>
              <input
                type="number"
                value={formData.longitud || ''}
                onChange={(e) => handleInputChange('longitud', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="Ej: 45"
              />
            </div>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Ubicación *</span>
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="Ej: Río Paraná - Puerto Iguazú"
              required
            />
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Fish className="w-4 h-4" />
              <span>Carnada *</span>
            </label>
            <select
              value={formData.carnada}
              onChange={(e) => handleInputChange('carnada', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              required
              disabled={loadingCarnadas}
            >
              <option value="">
                {loadingCarnadas ? 'Cargando carnadas...' : 'Seleccionar carnada'}
              </option>
              {Object.entries(carnadasPorTipo).map(([tipo, carnadasDelTipo]) => (
                <optgroup key={tipo} label={tipo}>
                  {carnadasDelTipo.map(carnada => (
                    <option key={carnada.id} value={carnada.id} title={carnada.descripcion}>
                      {carnada.nombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Clima
            </label>
            <select
              value={formData.clima || ''}
              onChange={(e) => handleInputChange('clima', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="">Seleccionar clima</option>
              {climas.map(clima => (
                <option key={clima} value={clima}>
                  {clima}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notas adicionales
            </label>
            <textarea
              value={formData.notas || ''}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
              placeholder="Describe tu experiencia, condiciones del agua, técnica utilizada, etc."
            />
          </div>

          {}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoadingData}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar Captura
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioCaptura
