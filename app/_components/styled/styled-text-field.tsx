'use client';

import { colors } from '@/utils/colors';
import { TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';

type StyledTextFieldProps = TextFieldProps;

export default function StyledTextField(props: StyledTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: typeof props.onFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur: typeof props.onBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <TextField
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
      fullWidth
      multiline={props.multiline}
      rows={props.rows}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          fontFamily: 'ComingSoon',
          fontSize: 16,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          '& fieldset': {
            borderColor: isFocused ? colors.focused : colors.blurred,
          },
          '&:hover fieldset': {
            borderColor: colors.focused,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.focused,
          },
        },
        ...props.sx,
      }}
    />
  );
}
