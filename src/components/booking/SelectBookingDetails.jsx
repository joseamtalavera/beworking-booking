import { useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBookingFlow } from '../../store/useBookingFlow.js';
import { fetchPublicAvailability } from '../../api/bookings.js';
import RoomCalendarGrid, { CalendarLegend } from './RoomCalendarGrid.jsx';
import { addMinutesToTime } from '../../utils/calendarUtils.js';
import ReservaDialog from './ReservaDialog.jsx';
const SelectBookingDetails = ({ room, onContinue }) => {
  const schedule = useBookingFlow((state) => state.schedule);
  const setSchedule = useBookingFlow((state) => state.setSchedule);

  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editBloqueo, setEditBloqueo] = useState(null);
  const [prefillSlot, setPrefillSlot] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['public-availability', schedule.date, room?.productName],
    queryFn: () =>
      fetchPublicAvailability({
        date: schedule.date,
        products: room?.productName ? [room.productName] : undefined
      }),
    enabled: Boolean(schedule.date)
  });

  const bloqueos = Array.isArray(data) ? data : [];

  const roomBloqueos = useMemo(() => {
    if (!room?.productName) {
      return bloqueos;
    }
    return bloqueos.filter((item) => item?.producto?.nombre === room.productName);
  }, [bloqueos, room]);

  const selectedSlotKey = useMemo(() => {
    if (schedule.startTime) {
      return `${room?.id || 'room'}-${schedule.startTime}`;
    }
    return '';
  }, [room?.id, schedule.startTime]);

  const handleSlotSelect = (slot, bloqueo) => {
    if (!schedule.date) {
      return;
    }

    if (bloqueo) {
      setEditBloqueo(bloqueo);
      return;
    }

    const nextEndTime = addMinutesToTime(slot.id, 30);
    setSchedule({
      date: schedule.date,
      startTime: slot.id,
      endTime: nextEndTime
    });
    setPrefillSlot({ date: schedule.date, startTime: slot.id, endTime: nextEndTime });
    setCreateDialogOpen(true);
  };

  const handleAttendeesChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setSchedule({ attendees: Number.isNaN(value) || value < 1 ? 1 : value });
  };

  const handleDateChange = (event) => {
    const nextDate = event.target.value;
    setSchedule({ date: nextDate, startTime: null, endTime: null });
  };

  const handleNewReserva = () => {
    setPrefillSlot(null);
    setCreateDialogOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateDialogOpen(false);
    setPrefillSlot(null);
  };

  const handleCloseEdit = () => {
    setEditBloqueo(null);
  };

  const handleReservaCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['bloqueos', schedule.date] });
    handleCloseCreate();
  };

  const handleReservaUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['bloqueos', schedule.date] });
    handleCloseEdit();
  };

  const dateLabel = useMemo(() => {
    if (!schedule.date) {
      return '';
    }
    return new Date(schedule.date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [schedule.date]);

  const isContinueDisabled = !schedule.date || !schedule.startTime || !schedule.endTime;

  return (
    <Stack spacing={4}>
      <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Booking details
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Browse live availability, open a new reserva modal, or edit existing bloqueos exactly like the internal
            dashboard experience.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          onClick={handleNewReserva}
          sx={{
            minWidth: 160,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#fb923c',
            '&:hover': {
              bgcolor: '#f97316'
            }
          }}
        >
          New reserva
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <TextField
          type="date"
          label="Select date"
          value={schedule.date || ''}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          type="number"
          label="Attendees"
          inputProps={{ min: 1, max: room?.capacity || 50 }}
          value={schedule.attendees}
          onChange={handleAttendeesChange}
          sx={{ maxWidth: 160 }}
        />
      </Stack>

      {isError ? (
        <Alert severity="error">{error?.message || 'Unable to fetch bloqueos for the selected date.'}</Alert>
      ) : null}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Stack spacing={2}>
          <CalendarLegend />
          <RoomCalendarGrid
            room={room}
            dateLabel={dateLabel}
            bloqueos={roomBloqueos}
            selectedSlotKey={selectedSlotKey}
            onSelectSlot={handleSlotSelect}
          />
        </Stack>
      )}

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onContinue} disabled={isContinueDisabled}>
          Continue
        </Button>
      </Box>

      <ReservaDialog
        open={createDialogOpen}
        mode="create"
        onClose={handleCloseCreate}
        onCreated={handleReservaCreated}
        defaultDate={prefillSlot?.date ?? schedule.date}
        defaultSlot={prefillSlot}
        room={room}
      />

      <ReservaDialog
        open={Boolean(editBloqueo)}
        mode="edit"
        onClose={handleCloseEdit}
        onUpdated={handleReservaUpdated}
        initialBloqueo={editBloqueo}
        room={room}
      />
    </Stack>
  );
};

export default SelectBookingDetails;
