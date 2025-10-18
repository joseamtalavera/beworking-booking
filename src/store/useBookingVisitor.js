import { create } from 'zustand';

const initialVisitorState = {
  contact: null,
  billing: null
};

export const useBookingVisitor = create((set) => ({
  ...initialVisitorState,
  setVisitorContact: (data) => set({ contact: data }),
  setBillingDetails: (data) => set({ billing: data }),
  resetVisitor: () => set(initialVisitorState)
}));
