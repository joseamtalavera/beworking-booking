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
    heroImage:
      'https://images.unsplash.com/photo-1529429617124-aee5070e55af?auto=format&fit=crop&w=1000&q=80',
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
    heroImage:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
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
    heroImage:
      'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1000&q=80',
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
    heroImage:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
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
    heroImage:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80',
    tags: ['Brainstorming', 'Whiteboard', 'Cozy']
  }
];

export const useCatalogRooms = create((set) => ({
  rooms: DEFAULT_ROOMS,
  setRooms: (nextRooms) => set({ rooms: nextRooms })
}));
