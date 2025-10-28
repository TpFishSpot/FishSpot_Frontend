export const buildImageUrl = (imagePath?: string): string => {
  if (!imagePath) return ''
  if (imagePath.startsWith("http")) return imagePath
  return `${import.meta.env.VITE_API_URL}/${imagePath}`
}

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
