// Mui
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Hooks
import { useEffect, useState } from 'react';

// Utils
import { getColor } from '@/utils/getColor';

// Styles
import { styles } from '../styles/validator-styles';
import useWindowSize from '@/hooks/useWindowSize';

export default function Searchbar({ search }) {
    const [searchValue, setSearchValue] = useState('');
    const [filterValues, setFilterValues] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const windowSize = useWindowSize();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/all`).then(res =>
            res.json().then(json => {
                setSubjects(json);
            })
        );
    }, []);

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

            {windowSize.width <= 500 && <div style={{ paddingBlock: '0.5rem' }} />}

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
                        <MenuItem key={subject.id} value={subject.name}>
                            {subject.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
