import { create } from 'zustand';

const DEFAULT_ROOMS = [
  {
    id: 'ma1a1',
    slug: 'ma1a1',
    name: 'Aula MA1A1',
    centro: 'Málaga Workspace',
    capacity: 6,
    priceFrom: 5,
    currency: 'EUR',
    productName: 'MA1A1',
    heroImage: 'https://be-working.com/wp-content/uploads/2025/09/MA1A1-0-featured-20220504133312-1.jpg',
    gallery: [
      'https://be-working.com/wp-content/uploads/2025/09/MA1A1-0-featured-20220504133312-1.jpg',
      'https://be-working.com/wp-content/uploads/2025/09/MA1A1-1-20220504133312.jpg',
      'https://be-working.com/wp-content/uploads/2025/09/MA1A1-2-20220504133312-scaled.jpg',
      'https://be-working.com/wp-content/uploads/2025/09/MA1A1-3-20220504133312.jpg',
      'https://be-working.com/wp-content/uploads/2025/09/MA1A1-4-20220504133312.jpg'
    ],
    description:
      'Nuestra Aula/ Sala 1 de Alejandro Dumas es perfecta para reuniones ó entrevistas. Tiene 15 m2 y esta Equipada con conexión internet 600 Mb simétricos, pizarra y mobiliario. Acceso 24 horas / 365 días. Proyector, Pizarra y Llave digital.',
    amenities: [
      'Acceso 24h',
      'Internet 600Mb',
      'Pizarra y papelógrafo',
      'Proyector',
      'Aire acondicionado',
      'Llave digital',
      'Taquilla',
      'Zona de descanso',
      'Soporte 24h',
      'Sin permanencia'
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
      'https://maps.google.com/maps?q=BeWorking+Coworking+Málaga+Calle+Alejandro+Dumas+17&t=&z=16&ie=UTF8&iwloc=&output=embed',
    availability: [],
    tags: ['Reuniones', 'Formación', 'Entrevistas']
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
    name: 'Aula MA1A4',
    centro: 'Málaga Workspace',
    capacity: 40,
    priceFrom: 48,
    currency: 'EUR',
    productName: 'MA1A4',
    heroImage: 'https://app.be-working.com/img/MA1A3-0-featured-20220504145833.jpg',
    gallery: [
      'https://app.be-working.com/img/MA1A3-0-featured-20220504145833.jpg',
      'https://app.be-working.com/img/MA1A3-1-20220504145833.jpg',
      'https://app.be-working.com/img/MA1A3-2-20220504145833.jpg',
      'https://app.be-working.com/img/MA1A3-3-20220504145833.jpg',
      'https://app.be-working.com/img/MA1A3-4-20220504145833.jpg'
    ],
    description:
      'Nuestra Aula/ Sala 3 de Alejandro Dumas es perfecta para reuniones, formaciones, eventos o entrevistas. Tiene 45 m2 y cuenta con conexión internet 600 Mb simétricos, pizarra, mobiliario y proyector. Zona de descanso, llave digital y alarma. Acceso 24 horas / 365 días.',
    amenities: [
      'Acceso 24h',
      'Internet 600Mb',
      'Pizarra y papelógrafo',
      'Proyector',
      'Aire acondicionado',
      'Llave digital',
      'Sin permanencia',
      'Escaner e impresora',
      'Soporte 24h',
      'Zona de descanso',
      'Alarma'
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
    tags: ['Reuniones', 'Formación', 'Eventos', 'Entrevistas']
  },
  {
    id: 'ma1a5',
    slug: 'ma1a5',
    name: 'Aula MA1A5',
    centro: 'Málaga Workspace',
    capacity: 20,
    priceFrom: 24,
    currency: 'EUR',
    productName: 'MA1A5',
    heroImage: 'https://app.be-working.com/img/MA1A5-0-featured-20240501123909.jpg',
    gallery: [
      'https://app.be-working.com/img/MA1A5-0-featured-20240501123909.jpg',
      'https://app.be-working.com/img/MA1A5-1-20240501123909.jpg',
      'https://app.be-working.com/img/MA1A5-2-20240501123909.jpg',
      'https://app.be-working.com/img/MA1A5-3-20240501123909.jpg',
      'https://app.be-working.com/img/MA1A5-4-20240501123909.jpg'
    ],
    description:
      'Nuestra Aula/ Sala 5 de Alejandro Dumas es perfecta para reuniones, eventos, formaciones ó entrevistas. Tiene 45 m2 y cuenta con conexión internet 600 Mb simétricos, pizarra y proyector. Zona de descanso, llave digital y alarma. Acceso 24 horas / 365 días.',
    amenities: [
      'Acceso 24h',
      'Agua gratis',
      'Aire acondicionado',
      'Internet 600Mb',
      'Llave digital',
      'Soporte 24h',
      'Zona de descanso'
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
    tags: ['Reuniones', 'Eventos', 'Formación', 'Entrevistas']
  },
  {
    id: 'ma1-desks',
    slug: 'ma1-desks',
    name: 'MA1 Desks',
    centro: 'Málaga Workspace',
    capacity: 16,
    priceFrom: 90,
    currency: 'EUR',
    productName: 'MA1 Desks',
    heroImage: 'https://app.be-working.com/img/MA1O1-1-0-featured-20220512103754.jpg',
    gallery: [
      'https://app.be-working.com/img/MA1O1-1-0-featured-20220512103754.jpg',
      'https://app.be-working.com/img/MA1O1-1-1-20220512103754.jpg',
      'https://app.be-working.com/img/MA1O1-1-2-20220512103754.jpg',
      'https://app.be-working.com/img/MA1O1-1-3-20220512103754.jpg',
      'https://app.be-working.com/img/MA1O1-1-4-20220512103754.jpg'
    ],
    description:
      'Coworking abierto de lunes a domingo 24 horas. Sin permanencias ni depósitos. Zona de Cafetería y Descanso, Impresora / Fotocopiadora. Llave Digital, Alarma, Sala Exterior y Luminosa.',
    amenities: [
      'Acceso 24h',
      'Agua gratis',
      'Aire acondicionado',
      'Alarma',
      'Escaner e impresora',
      'Internet 600Mb',
      'Llave digital',
      'Mesa Coworking',
      'Oficina virtual',
      'Pizarra y papelógrafo',
      'Proyector',
      'Sin permanencia',
      'Soporte 24h',
      'Taquilla',
      'Zona de descanso'
    ],
    tags: ['Coworking', 'Flexible', '24h'],
    cancellationPolicy: [
      'Cambios admitidos hasta 24 h antes del inicio.',
      'Modificaciones vía correo electrónico.',
      'No hay reembolso en caso de no asistencia.'
    ],
    bookingInstructions: [
      'Solicita tu horario y espera confirmación.',
      'Recibirás la factura y enlace de pago.',
      'Tras el pago recibirás la asignación exacta del desk.'
    ]
  }
];

export const useCatalogRooms = create((set) => ({
  rooms: DEFAULT_ROOMS,
  setRooms: (nextRooms) => set({ rooms: nextRooms })
}));
