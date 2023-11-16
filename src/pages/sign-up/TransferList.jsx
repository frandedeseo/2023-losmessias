import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import Alert from '../../components/Alert.jsx';
import LoadingModal from '@/components/modals/LoadingModal';

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

export default function TransferList({ request, setPage }) {

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const { open, setOpen, alertState, sendRequestForRegistrationProfessor } = useApi();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/all`)
            .then(response => response.json())
            .then(json => {
                setLeft(json);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const obj = {};
        right.forEach((element, index) => {
            obj[`${index}`] = element;
        });
        sendRequestForRegistrationProfessor(request, right, setIsProcessing);
        await sleep(2000);
        setPage('login');
    };
    var sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = index => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List dense component='div' role='list'>
                {index.map(value => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value.id} role='listitem' button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.name}`} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    return (

        <Grid component='form' onSubmit={handleSubmit} container spacing={2} justifyContent='center' alignItems='center'>
            <Typography component='h4' variant='h5'>
                Choose the subjects your are capable of teaching:
            </Typography>

            <Alert open={open} setOpen={setOpen} message={alertState.message} severity={alertState.severity} />

            <Grid item>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction='column' alignItems='center'>
                    <Button
                        sx={{ my: 0.5 }}
                        variant='outlined'
                        size='small'
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label='move all right'
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant='outlined'
                        size='small'
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label='move selected right'
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant='outlined'
                        size='small'
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label='move selected left'
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant='outlined'
                        size='small'
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label='move all left'
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList(right)}</Grid>

            <Button disabled={right.length == 0} type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                Finish
            </Button>
            <LoadingModal isOpen={isProcessing} message={'Processing registration...'} />
        </Grid>
    );
}
