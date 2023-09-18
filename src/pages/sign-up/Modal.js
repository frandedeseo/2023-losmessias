import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
//import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

export default function Modal() {
    const [duration, setDuration] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleChange = (event) => {
        setDuration(event.target.value);
    };
      
        return (
          <div>
            <Button variant="outlined" onClick={handleClickOpen}>
              Open dialog
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Reserve class:
              </DialogTitle>
              <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
              <DialogContent dividers>
                <Grid container  sx={{ width: 550 }}>
                    <Typography component="h4" variant="h5">
                        Professor: Dr. Mudano
                    </Typography>
                    <Typography component="h4" variant="h5">
                        Price: 3000
                    </Typography>
            
             
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker />
                        <DemoContainer
                            components={[
                            'MobileTimePicker',
        
                            ]}
                        >
                            <DemoItem label="Choose the hour">
                                <MobileTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider> */}
                <Box sx={{ minWidth: 120,maxWidth: 200 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={duration}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={60}>60 min</MenuItem>
                            <MenuItem value={90}>90 min</MenuItem>
                            <MenuItem value={120}>120 min</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                </Grid>
              </DialogContent>
              <DialogActions>
            <Button
                type="submit"
                onClick={handleClose}
            >
                Confirm Reservation
            </Button>
              </DialogActions>
            </BootstrapDialog>
          </div>
    
  );
}
