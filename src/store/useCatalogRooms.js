import { create } from 'zustand';

const DEFAULT_ROOMS = [
  {
    id: 'ma1a1',
    slug: 'ma1a1',
    name: 'MA1A1',
    centro: 'Málaga Workspace',
    capacity: 8,
    priceFrom: 35,
    currency: 'EUR',
    productName: 'MA1A1',
    heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573164713710-3ba1d3b957b4?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Nuestra Aula/Sala 4 en Alejandro Dumas 17 es perfecta para reuniones, formaciones y entrevistas. 45 m² equipados con fibra simétrica, pantalla y zona lounge.',
    amenities: [
      'Pantalla de 65"',
      'Pizarra y rotuladores',
      'Conexión 600 Mb simétrica',
      'Climatización independiente',
      'Coffee corner self-service',
      'Acceso 24/7 con llave digital'
    ],
    cancellationPolicy: [
      'Cambios admitidos hasta 24 h antes del inicio.',
      'Modificaciones vía correo electrónico.',
      'No hay reembolso en caso de no asistencia.'
    ],
    bookingInstructions: [
      'Solicita tu horario y espera confirmación.',
      'Recibirás la factura y enlace de pago.',
      'Tras el pago te enviaremos instrucciones y acceso.'
    ],
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9975481.89859359!2d-13.865541969374726!3d40.20864084878176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0e320f8d25d7f7%3A0x40340f63c70c1c0!2sEspaña!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses',
    availability: [
      {
        id: 'seed-1',
        fechaIni: '2024-06-18T09:00:00',
        fechaFin: '2024-06-18T11:00:00',
        estado: 'paid',
        cliente: { nombre: 'Marketing meetup' },
        centro: { nombre: 'Málaga Workspace' },
        producto: { nombre: 'MA1A1' }
      },
      {
        id: 'seed-2',
        fechaIni: '2024-06-18T15:00:00',
        fechaFin: '2024-06-18T16:30:00',
        estado: 'created',
        cliente: { nombre: 'Bloqueo interno' },
        centro: { nombre: 'Málaga Workspace' },
        producto: { nombre: 'MA1A1' }
      }
    ],
    tags: ['TV Screen', 'Whiteboard', 'Video conferencing']
  },
  {
    id: 'ma1a2',
    slug: 'ma1a2',
    name: 'MA1A2',
    centro: 'Málaga Workspace',
    capacity: 10,
    priceFrom: 42,
    currency: 'EUR',
    productName: 'MA1A2',
    heroImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Sala versátil con paneles acústicos y disposición flexible ideal para workshops creativos y sesiones híbridas.',
    amenities: ['Workshop ready', 'Soundproofing', 'Streaming kit', 'Mobiliario modular'],
    tags: ['Workshop ready', 'Soundproofing']
  },
  {
    id: 'ma1a3',
    slug: 'ma1a3',
    name: 'MA1A3',
    centro: 'Málaga Workspace',
    capacity: 6,
    priceFrom: 30,
    currency: 'EUR',
    productName: 'MA1A3',
    heroImage: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1528722828814-77b0f10adf4c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Video conferencing', 'High-speed Wi-Fi', 'Sala íntima'],
    tags: ['Video conferencing', 'High-speed Wi-Fi']
  },
  {
    id: 'ma1a4',
    slug: 'ma1a4',
    name: 'MA1A4',
    centro: 'Málaga Workspace',
    capacity: 12,
    priceFrom: 48,
    currency: 'EUR',
    productName: 'MA1A4',
    heroImage: 'https://images.unsplash.com/photo-1570129476769-55f4a5add5a3?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570129476769-55f4a5add5a3?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1518608822073-054117e1ff30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1467241850590-b62b50879f53?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Hybrid ready', 'Panoramic view', 'Sistema AV premium'],
    tags: ['Hybrid ready', 'Panoramic view']
  },
  {
    id: 'ma1a5',
    slug: 'ma1a5',
    name: 'MA1A5',
    centro: 'Málaga Workspace',
    capacity: 4,
    priceFrom: 24,
    currency: 'EUR',
    productName: 'MA1A5',
    heroImage: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1524578271613-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Brainstorming', 'Whiteboard', 'Cozy'],
    tags: ['Brainstorming', 'Whiteboard', 'Cozy']
  }
];

export const useCatalogRooms = create((set) => ({
  rooms: DEFAULT_ROOMS,
  setRooms: (nextRooms) => set({ rooms: nextRooms })
}));
