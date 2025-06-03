import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
const SearchViaComponent = ({ handleSearch }) => {
  const [searchBy, setSearchBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    // Call the API or perform search logic based on searchBy and searchTerm
    handleSearch(searchBy, searchTerm);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <FormControl variant="outlined" style={{ minWidth: 200, marginRight: 20, marginBottom:20 }}>
        <InputLabel id="search-by-label">Search By</InputLabel>
        <Select
          labelId="search-by-label"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          label="Search By"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="token">Token No</MenuItem>
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
      <TextField
        variant="outlined"
        label={`Enter ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginRight: 20 }}
      />
      <Button variant="contained" color="primary" onClick={handleSearchClick}>
        Search
      </Button>
    </motion.div>
  );
};

export default SearchViaComponent;
