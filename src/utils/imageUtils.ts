/**
 * Construye la URL completa para una imagen desde el servidor
 * @param imagePath - Ruta de la imagen (puede incluir o no 'uploads/')
 * @returns URL completa de la imagen
 */
/**
 * Construye la URL completa para una imagen desde el servidor
 * Replicando exactamente la lógica de especies que funciona perfectamente
 * @param imagePath - Ruta de la imagen (puede incluir o no 'uploads/')
 * @returns URL completa de la imagen
 */
export const buildImageUrl = (imagePath?: string): string => {
  if (!imagePath) return ''
  if (imagePath.startsWith("http")) return imagePath
  return `${import.meta.env.VITE_API_URL}/${imagePath}`
}

/**
 * Verifica si una imagen existe y está disponible
 * @param imagePath - Ruta de la imagen
 * @returns Promise que resuelve true si la imagen existe
 */
export const checkImageExists = async (imagePath?: string): Promise<boolean> => {
  if (!imagePath) {
    return false
  }
  
  try {
    const url = buildImageUrl(imagePath)
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
