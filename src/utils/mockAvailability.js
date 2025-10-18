export const buildMockAvailability = (days = 7) => {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    return {
      date: isoDate,
      slots: [
        { from: '09:00', to: '11:00' },
        { from: '12:00', to: '14:00' },
        { from: '16:00', to: '18:00' }
      ]
    };
  });
};
