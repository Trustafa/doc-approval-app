'use client';

import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useState } from 'react';
type SearchBarProps = {
  onSearch: (value: string) => void;
};
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    onSearch(value);
  };

  return (
    <OutlinedInput
      placeholder="Search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={handleSearch} edge="end" color="primary">
            <Search />
          </IconButton>
        </InputAdornment>
      }
      fullWidth
      sx={{ mb: 2 }}
    />
  );
}
