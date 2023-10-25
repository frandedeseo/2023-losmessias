import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useApi } from '../../hooks/useApi.js';
import Alert from '../../components/Alert.jsx';
import LoadingModal from '@/components/modals/LoadingModal.jsx';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

export default function ForgotPassword({ setPage }) {
	const { alertState, open, setOpen, validateEmailForPasswordChange } = useApi();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		const datos = new FormData(event.currentTarget);
		const request = {
			email: datos.get('email')
		};
		validateEmailForPasswordChange(request, setIsProcessing);
	};

	return (
		<>
			<Typography component="h1" variant="h5">
				Recover Password
			</Typography>
			<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, marginTop: 5 }}>
				<Alert open={open} setOpen={setOpen} message={alertState.message} severity={alertState.severity} />
				<Typography component="h7" variant="h7">
					We will send you an email for confirmation
				</Typography>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					disabled={isProcessing}
					sx={{ mt: 3, mb: 2 }}
				>
					{!isProcessing && <CircularProgress size={20} style={{ marginRight: 10 }} />}
					Send Email
				</Button>
				<Grid container justifyContent="flex-end">
					<Grid item>
						<Link href="#" variant="body2" onClick={() => setPage("signup")} >
							{"Don't have an account? Sign Up"}
						</Link>
					</Grid>
				</Grid>
			</Box>
			<LoadingModal open={isProcessing} message={"Sending recovery email..."} />
		</>
	);
}