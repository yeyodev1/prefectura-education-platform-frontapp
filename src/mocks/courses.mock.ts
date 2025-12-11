export type MockCourse = {
  id: string
  name: string
  description: string
  is_published: boolean
  image_url: string
}

const mockTitles: string[] = [
  'Costeo de Recetas y Porciones',
  'Gestión de Inventarios para Cocina',
  'Ingeniería de Menú (Menu Engineering)',
  'Marketing Gastronómico en Redes',
  'Operación de Cocina Eficiente',
  'Dark Kitchen Avanzada',
  'Fidelización y Servicio al Cliente',
  'Experiencia del Cliente en Restaurantes',
  'Fotografía de Alimentos para Ventas',
  'Higiene y BPM en Cocina',
  'Estandarización de Recetas',
  'Control de Merma y Pérdidas'
]

const knownImages: string[] = [
  'https://uploads.teachablecdn.com/attachments/f918edff8a32404da3f15661db0dd920.jpg',
  'https://uploads.teachablecdn.com/attachments/089997c835684f7f8cb2b94bd73e4320.png',
  'https://uploads.teachablecdn.com/attachments/450b1cd9d0494b508310ae8a834384c0.png'
]

export function makePlaceholders(count: number): MockCourse[] {
  const n = Math.max(0, Number(count) || 0)
  return Array.from({ length: n }, (_, i) => ({
    id: `mock-${i + 1}`,
    name: String(mockTitles[i % mockTitles.length] || `Curso sorpresa ${i + 1}`),
    description: 'Disponible próximamente',
    is_published: false,
    image_url: String(knownImages[i % knownImages.length] || '')
  }))
}
