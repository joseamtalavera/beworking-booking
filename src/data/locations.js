const locations = {
  malaga: {
    slug: 'malaga',
    name: 'Malaga',
    displayName: 'Malaga',
    address: 'Calle Alejandro Dumas 17, Oficinas',
    zip: '29004 Malaga',
    phone: '+34 640 369 759',
    email: 'info@be-working.com',
    hours: 'Lun - Vie: 9:00 - 20:00',
    mapQuery: 'BeWorking,Calle+Alejandro+Dumas+17,Málaga',
    mapCenter: { lat: 36.7213, lng: -4.4214 },
    centerCode: 'MA1',
    services: [
      { slug: 'salas-de-reunion', labelKey: 'locations.services.meetingRooms' },
      { slug: 'coworking', labelKey: 'locations.services.coworking' },
      { slug: 'oficina-virtual', labelKey: 'locations.services.virtualOffice' },
    ],
    seo: {
      city: {
        title: 'Espacios de trabajo en Malaga | BeSpaces',
        description: 'Salas de reuniones, coworking y oficinas virtuales en Malaga. Reserva tu espacio ideal en BeSpaces.',
      },
      meetingRooms: {
        title: 'Salas de reunion en Malaga | BeSpaces',
        description: 'Reserva salas de reuniones equipadas en Malaga. Wifi, proyector y todo lo que necesitas para tu reunion.',
      },
      coworking: {
        title: 'Coworking en Malaga | BeSpaces',
        description: 'Espacios de coworking flexibles en Malaga. Escritorios dedicados con todo incluido.',
      },
      virtualOffice: {
        title: 'Oficina virtual en Malaga | BeSpaces',
        description: 'Oficina virtual en Malaga desde 15EUR/mes. Domicilio fiscal, recepcion de correo y acceso a espacios de trabajo.',
      },
    },
  },
};

export function getLocation(slug) {
  return locations[slug] || null;
}

export function getAllLocations() {
  return Object.values(locations);
}

export default locations;
