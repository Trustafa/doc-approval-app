'use client';

import { Search } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useState } from 'react';
type SearchBarProps = {
  onSearch: () => void;
  placeholder?: string;
};
export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    onSearch();
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{placeholder ?? 'Search'}</InputLabel>
      <OutlinedInput
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
    </FormControl>
  );
}
