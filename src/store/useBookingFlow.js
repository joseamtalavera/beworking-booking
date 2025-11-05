import { create } from 'zustand';

const todayISO = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const initialState = {
  activeStep: 0,
  steps: ['details', 'contact', 'payment'],
  schedule: {
    date: todayISO(),
    startTime: null,
    endTime: null,
    attendees: 1
  }
};

export const useBookingFlow = create((set) => ({
  ...initialState,
  setActiveStep: (step) => set({ activeStep: step }),
  nextStep: () =>
    set((state) => {
      const next = Math.min(state.activeStep + 1, state.steps.length - 1);
      return { activeStep: next };
    }),
  prevStep: () =>
    set((state) => {
      const prev = Math.max(state.activeStep - 1, 0);
      return { activeStep: prev };
    }),
  setSchedule: (partial) =>
    set((state) => ({
      schedule: { ...state.schedule, ...partial }
    })),
  resetFlow: () => set(initialState)
}));
