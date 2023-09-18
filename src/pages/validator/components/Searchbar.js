import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const subjects = ['Physics', 'Math', 'Biology', 'History'];

export default function Searchbar() {
    return (
        <>
            <div style={{ display: 'inline-flex' }}>
                <TextField label='Search' variant='outlined' size='small' sx={{ width: '18rem' }} />
                <Button
                    variant='contained'
                    sx={{
                        boxShadow: 'none',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        transform: 'translateX(-100%)',
                    }}
                >
                    <SearchIcon />
                </Button>
            </div>

            <FormControl sx={{ width: '15rem', marginLeft: '-2rem' }}>
                <InputLabel size='small'>Subjects</InputLabel>
                <Select
                    value={[]}
                    size='small'
                    multiple
                    input={<OutlinedInput label='Subjects' />}
                    renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map(value => (
                                <Chip key={value} label={value} />
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
