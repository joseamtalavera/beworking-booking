import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

/**
 * Drop-in replacement for MUI TextField that shows an X clear button
 * when the field has a value. Calls onChange with an empty string when clicked.
 */
export default function ClearableTextField({ value, onChange, InputProps, slotProps, select, type, disabled, ...rest }) {
  const showClear = !select && type !== 'password' && !disabled && value != null && value !== '';

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

  const existingEnd = InputProps?.endAdornment;
  const endAdornment = (
    <InputAdornment position="end">
      {existingEnd}
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
    </InputAdornment>
  );

  return (
    <TextField
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled}
      InputProps={{ ...(InputProps || {}), endAdornment }}
      slotProps={slotProps}
      {...rest}
    />
  );
}
