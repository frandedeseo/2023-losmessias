import { Box } from "@mui/material";
import PersonalDataItem from "./PersonalDataItem";
import { styles } from "./styles";

export default function PersonalDataDisplay({ data }) {
    return (
        <Box sx={styles.container}>
            <PersonalDataItem name="First name" value={data.firstName} />
            <PersonalDataItem name="Last name" value={data.lastName} />
            <PersonalDataItem name="Email" value={data.email} />
            <PersonalDataItem name="Location" value={data.location} />
            <PersonalDataItem name="Phone" value={data.phone} />
        </Box>
    );
}