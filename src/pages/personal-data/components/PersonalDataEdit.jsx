import { Box, Typography } from '@mui/material';
import PersonalItemEdit from './PersonalItemEdit';
import { styles } from '../../../styles/personal-data-styles';
import PersonalDataItem from './PersonalDataItem';

export default function PersonalDataEdit({ data, setFirstName, setLastName, setLocation, setPhone }) {
    return (
        <Box sx={styles.container}>
            {data ? (
                <>
                    <PersonalItemEdit name='First name' value={data.firstName} handleEdit={setFirstName} />
                    <PersonalItemEdit name='Last name' value={data.lastName} handleEdit={setLastName} />
                    <PersonalDataItem name='Email' value={data.email} />
                    <PersonalItemEdit name='Location' value={data.location} handleEdit={setLocation} />
                    <PersonalItemEdit name='Phone' value={data.phone} handleEdit={setPhone} />
                </>
            ) : (
                <Typography variant='h5'>Loading...</Typography>
            )}
        </Box>
    );
}
