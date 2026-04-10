import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import TextField from '../common/ClearableTextField';
import { useTranslation } from 'react-i18next';
import { buildTimeSlots, timeStringToMinutes } from '../../utils/calendarUtils';

export default function TimeSlotSelect({
  label,
  value,
  onChange,
  slots,
  bookedSlotIds,
  minTime,
  maxTime,
  isEndTime = false,
}) {
  const { t } = useTranslation();

  const filteredSlots = useMemo(() => {
    const allSlots = slots || buildTimeSlots();
    const minMin = timeStringToMinutes(minTime);
    const maxMin = timeStringToMinutes(maxTime);
    return allSlots.filter((slot) => {
      const m = timeStringToMinutes(slot.id);
      if (m == null) return false;
      if (minMin != null && m < minMin) return false;
      if (maxMin != null && m > maxMin) return false;
      return true;
    });
  }, [slots, minTime, maxTime]);

  return (
    <TextField
      variant="standard"
      select
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
      sx={{
        '& .MuiInputLabel-root': {
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'text.primary',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
        '& .MuiInput-input': {
          fontSize: '0.875rem',
          color: value ? 'text.primary' : 'text.secondary',
          py: 0.25,
        },
      }}
    >
      {filteredSlots.map((slot) => {
        const isBooked = bookedSlotIds?.has(slot.id) && !(isEndTime && maxTime && slot.id === maxTime);
        return (
          <MenuItem key={slot.id} value={slot.id} disabled={isBooked}>
            {slot.label}
            {isBooked && (
              <span style={{ marginLeft: 8, color: '#dc2626', fontSize: '0.75rem' }}>
                — {t('booking.slotBooked')}
              </span>
            )}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
