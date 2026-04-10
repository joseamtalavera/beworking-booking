import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

/**
 * Drop-in replacement for MUI TextField that shows an X clear button
 * when the field has a value. Calls onChange with an empty string when clicked.
 *
 * Skipped automatically when:
 * - select={true} (dropdowns don't need clear buttons)
 * - type === 'password' (use the show/hide toggle instead)
 * - type === 'date' (browsers have their own clear UI)
 * - disabled or readonly
 */
export default function ClearableTextField({ value, onChange, InputProps, slotProps, select, type, disabled, ...rest }) {
  const showClear =
    !select &&
    type !== 'password' &&
    type !== 'date' &&
    type !== 'datetime-local' &&
    type !== 'time' &&
    !disabled &&
    value != null &&
    value !== '';

  const handleClear = () => {
    if (!onChange) return;
    onChange({ target: { value: '' } });
  };

  if (!showClear) {
    return (
      <TextField
        value={value}
        onChange={onChange}
        InputProps={InputProps}
        slotProps={slotProps}
        select={select}
        type={type}
        disabled={disabled}
        {...rest}
      />
    );
  }

  const clearButton = (
    <IconButton
      size="small"
      onClick={handleClear}
      edge="end"
      sx={{ p: 0.25, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
      tabIndex={-1}
      aria-label="clear"
    >
      <ClearRoundedIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  // Support both legacy InputProps and new slotProps.input (MUI v7)
  // We need to merge endAdornment into whichever one is being used,
  // preserving any existing endAdornment.
  let nextSlotProps = slotProps;
  let nextInputProps = InputProps;

  if (slotProps?.input !== undefined) {
    // MUI v7 style — merge into slotProps.input
    const existingSlotInput = slotProps.input || {};
    const existingEnd = existingSlotInput.endAdornment;
    nextSlotProps = {
      ...slotProps,
      input: {
        ...existingSlotInput,
        endAdornment: (
          <InputAdornment position="end">
            {existingEnd}
            {clearButton}
          </InputAdornment>
        ),
      },
    };
  } else {
    // Legacy InputProps style
    const existingEnd = InputProps?.endAdornment;
    nextInputProps = {
      ...(InputProps || {}),
      endAdornment: (
        <InputAdornment position="end">
          {existingEnd}
          {clearButton}
        </InputAdornment>
      ),
    };
  }

  return (
    <TextField
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled}
      InputProps={nextInputProps}
      slotProps={nextSlotProps}
      {...rest}
    />
  );
}
