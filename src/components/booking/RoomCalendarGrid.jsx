'use client';

import { useMemo } from 'react';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  buildTimeSlots,
  buildTimeSlotsFromBloqueos,
  bloqueoCoversSlot,
  describeBloqueo,
  getInitials,
  mapStatusKey,
  statusStyles,
} from '../../utils/calendarUtils';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

export const CalendarLegendItem = ({ label, color }) => (
  <Stack direction="row" spacing={0.85} alignItems="center">
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: '4px',
        border: '1px solid',
        borderColor: color?.borderColor || colors.line,
        bgcolor: color?.bgcolor || 'transparent',
      }}
    />
    <Typography sx={{ fontSize: '0.75rem', color: colors.ink2 }}>{label}</Typography>
  </Stack>
);

export const CalendarLegend = ({ styles: stylesProp }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = stylesProp || statusStyles(theme);

  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
      <CalendarLegendItem label={t('calendar.legendAvailable')} color={styles.available} />
      <CalendarLegendItem label={t('calendar.legendBooked')} color={styles.booked} />
    </Stack>
  );
};

const RoomCalendarGrid = ({
  dateLabel,
  room,
  bloqueos = [],
  selectedSlotKey,
  onSelectSlot,
  interactive = !!onSelectSlot,
  isDesk = false,
  deskSlotInfo = null,
  deskCount = 16,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const timeSlots = useMemo(
    () => (isDesk ? buildTimeSlots() : buildTimeSlotsFromBloqueos(bloqueos)),
    [isDesk, bloqueos],
  );
  const resolvedStatusStyles = useMemo(() => statusStyles(theme), [theme]);
  const tableMinWidth = useMemo(() => {
    const slotWidth = 64;
    const baseRoomColumn = 120;
    const paddings = 16;
    return Math.max(720, baseRoomColumn + timeSlots.length * slotWidth + paddings);
  }, [timeSlots.length]);

  const getSlotStatus = (slotId) => {
    const bloqueo = bloqueos.find((entry) => bloqueoCoversSlot(entry, slotId));
    if (!bloqueo) return { status: 'available', bloqueo: null };
    return { status: mapStatusKey(bloqueo.estado), bloqueo };
  };

  const renderMobileGrid = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {timeSlots.map((slot) => {
        const slotKey = `${room?.id || 'room'}-${slot.id}`;
        let status; let bloqueo; let deskFreeCount;
        if (isDesk) {
          const info = deskSlotInfo ? deskSlotInfo[slot.id] : null;
          if (info && info.fullyBooked) {
            status = 'paid';
            bloqueo = { _synthetic: true };
          } else {
            status = 'available';
            bloqueo = null;
          }
          deskFreeCount = info ? info.freeCount : deskCount;
        } else {
          const result = getSlotStatus(slot.id);
          status = result.status;
          bloqueo = result.bloqueo;
        }
        const styles = resolvedStatusStyles[status] || resolvedStatusStyles.created;
        const isSelected = selectedSlotKey === slotKey;
        return (
          <Box
            key={slotKey}
            {...(interactive ? {
              role: 'button',
              tabIndex: 0,
              onClick: () => onSelectSlot?.(slot, bloqueo),
              onKeyDown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectSlot?.(slot, bloqueo);
                }
              },
            } : {})}
            sx={{
              height: 44,
              minWidth: 64,
              flex: '1 0 auto',
              borderRadius: `${radius.md}px`,
              border: '2px solid',
              borderColor: isSelected ? colors.brand : styles.borderColor,
              bgcolor: styles.bgcolor,
              color: styles.color,
              cursor: interactive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `transform ${motion.duration} ${motion.ease}, border-color ${motion.duration} ${motion.ease}`,
              ...(interactive ? { '&:hover': { transform: 'scale(1.05)' } } : {}),
              outline: 'none',
              px: 1,
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {slot.label}
              {isDesk && bloqueo
                ? ' (0)'
                : isDesk
                  ? ` (${deskFreeCount})`
                  : bloqueo
                    ? ` · ${getInitials(bloqueo.cliente?.nombre || bloqueo.producto?.nombre || 'Reservado')}`
                    : ''}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.line}`,
        width: '100%',
        maxWidth: 1240,
        mx: 'auto',
        overflow: 'hidden',
        bgcolor: colors.bg,
      }}
    >
      <Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={0.5}>
          <Typography
            sx={{
              ...typography.body,
              fontWeight: 700,
              color: colors.ink,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('calendar.availabilityTitle')} · {room?.name || t('calendar.meetingRoom')}
          </Typography>
          {dateLabel ? (
            <Typography sx={{ fontSize: '0.85rem', color: colors.ink3 }}>
              {dateLabel}
            </Typography>
          ) : null}
        </Stack>

        {isMobile ? renderMobileGrid() : (
          <TableContainer
            sx={{
              maxHeight: 420,
              overflowX: 'auto',
              overflowY: 'hidden',
              width: '100%',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: tableMinWidth,
                tableLayout: 'fixed',
                '& .MuiTableCell-root': {
                  borderRight: `1px solid ${colors.lineSoft}`,
                },
                '& .MuiTableRow-root': {
                  borderBottom: `1px solid ${colors.lineSoft}`,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: { xs: 100, sm: 140, md: 180 },
                      minWidth: { xs: 100, sm: 140, md: 180 },
                      position: 'sticky',
                      top: 0,
                      left: 0,
                      bgcolor: colors.bg,
                      zIndex: 4,
                      borderRight: `1px solid ${colors.line}`,
                      boxShadow: '4px 0 12px rgba(0,0,0,0.04)',
                      color: colors.ink,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    {t('calendar.room')}
                  </TableCell>
                  {timeSlots.map((slot) => (
                    <TableCell
                      key={slot.id}
                      align="center"
                      sx={{
                        position: 'sticky',
                        top: 0,
                        width: 64,
                        maxWidth: 64,
                        bgcolor: colors.bg,
                        zIndex: 3,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: colors.ink }}>
                        {slot.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      width: { xs: 100, sm: 140, md: 180 },
                      minWidth: { xs: 100, sm: 140, md: 180 },
                      bgcolor: colors.bg,
                      zIndex: 2,
                      borderRight: `1px solid ${colors.line}`,
                      boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.ink }}>
                        {isDesk ? t('calendar.desks') : (room?.name || room?.label || t('calendar.meetingRoom'))}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: colors.ink3 }}>
                        {isDesk
                          ? t('calendar.deskCount', { count: deskCount })
                          : (room?.capacity ? t('calendar.capacityGuests', { count: room.capacity }) : '')}
                      </Typography>
                    </Stack>
                  </TableCell>
                  {timeSlots.map((slot) => {
                    const slotKey = `${room?.id || 'room'}-${slot.id}`;

                    let status; let bloqueo; let deskFreeCount;
                    if (isDesk) {
                      const info = deskSlotInfo ? deskSlotInfo[slot.id] : null;
                      if (info && info.fullyBooked) {
                        status = 'paid';
                        bloqueo = { _synthetic: true };
                      } else {
                        status = 'available';
                        bloqueo = null;
                      }
                      deskFreeCount = info ? info.freeCount : deskCount;
                    } else {
                      const result = getSlotStatus(slot.id);
                      status = result.status;
                      bloqueo = result.bloqueo;
                    }

                    const styles = resolvedStatusStyles[status] || resolvedStatusStyles.created;
                    const isSelected = selectedSlotKey === slotKey;

                    const tooltipText = isDesk
                      ? (bloqueo
                          ? t('calendar.allDesksBooked')
                          : t('calendar.desksAvailable', { free: deskFreeCount, total: deskCount }))
                      : (interactive ? describeBloqueo(bloqueo) : '');

                    return (
                      <TableCell
                        key={`${room?.id ?? 'room'}-${slot.id}`}
                        align="center"
                        sx={{ p: 0.75, width: 64, maxWidth: 64 }}
                      >
                        <Tooltip arrow title={tooltipText}>
                          <Box
                            {...(interactive ? {
                              role: 'button',
                              tabIndex: 0,
                              onClick: () => onSelectSlot?.(slot, bloqueo),
                              onKeyDown: (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  onSelectSlot?.(slot, bloqueo);
                                }
                              },
                            } : {})}
                            sx={{
                              height: 52,
                              width: '100%',
                              borderRadius: `${radius.md}px`,
                              border: '2px solid',
                              borderColor: isSelected ? colors.brand : styles.borderColor,
                              bgcolor: styles.bgcolor,
                              color: styles.color,
                              cursor: interactive ? 'pointer' : 'default',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: `transform ${motion.duration} ${motion.ease}, border-color ${motion.duration} ${motion.ease}`,
                              ...(interactive ? { '&:hover': { transform: 'scale(1.05)' } } : {}),
                              outline: 'none',
                            }}
                          >
                            {isDesk ? (
                              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {!bloqueo ? deskFreeCount : 0}
                              </Typography>
                            ) : bloqueo ? (
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {getInitials(bloqueo.cliente?.nombre || bloqueo.producto?.nombre || 'Reservado')}
                              </Typography>
                            ) : null}
                          </Box>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Paper>
  );
};

export default RoomCalendarGrid;
