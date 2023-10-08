// Mui
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Hooks
import { useState } from 'react';

// Utils
import { getColor } from '@/utils/getColor';
import { subjects } from '@/constants';

// Styles
import { styles } from '../pages/validator/styles';

export default function Searchbar({ search }) {
    const [searchValue, setSearchValue] = useState('');
    const [filterValues, setFilterValues] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        search(searchValue, filterValues);
    };

    const handleFilterChange = event => {
        setFilterValues(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={styles.searchForm}>
                <TextField
                    value={searchValue}
                    onChange={event => setSearchValue(event.target.value)}
                    label='Search'
                    variant='outlined'
                    size='small'
                    sx={styles.searchInput}
                />
                <Button variant='contained' type='submit' sx={styles.searchButton}>
                    <SearchIcon />
                </Button>
            </form>

            <FormControl sx={styles.select}>
                <InputLabel size='small'>Subjects</InputLabel>
                <Select
                    value={filterValues}
                    onChange={handleFilterChange}
                    size='small'
                    multiple
                    onClose={() => search(searchValue, filterValues)}
                    input={<OutlinedInput label='Subjects' />}
                    renderValue={selected => (
                        <Box sx={styles.selectChip}>
                            {selected.map(value => (
                                <Chip key={value} label={value} sx={{ backgroundColor: getColor(value) }} />
                            ))}
                        </Box>
                    )}
                >
                    {subjects.map(subject => (
                        <MenuItem key={subject} value={subject}>
                            {subject}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
