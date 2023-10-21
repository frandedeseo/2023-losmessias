import { Box, Typography } from "@mui/material";
import PersonalItemEdit from "./PersonalItemEdit";
import { styles } from "../../../styles/personal-data-styles";
import PersonalDataItem from "./PersonalDataItem";

export default function PersonalDataEdit({ data, setEmailAddress, setLocation, setPhone }) {

    return (
        <Box sx={styles.container}>
            {data ? (
                <>
                    <PersonalDataItem name="First name" value={data.firstName} />
                    <PersonalDataItem name="Last name" value={data.lastName} />
                    <PersonalItemEdit name="Email" value={data.email} handleEdit={setEmailAddress} />
                    <PersonalItemEdit name="Location" value={data.location} handleEdit={setLocation} />
                    <PersonalItemEdit name="Phone" value={data.phone} handleEdit={setPhone} />
                </>
            ) : (
                <Typography variant="h5">Loading...</Typography>
            )}
        </Box>
    );
}