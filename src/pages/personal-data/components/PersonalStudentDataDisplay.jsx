import { Box } from "@mui/material";
import PersonalDataItem from "./PersonalDataItem";
import { styles } from "./styles";

export default function PersonalStudentDataDisplay({ data }) {
    return (
        <Box sx={styles.container}>
            <PersonalDataItem name="First name" value={data.firstName} />
            <PersonalDataItem name="Last name" value={data.lastName} />
            <PersonalDataItem name="Email" value={data.email} />
            {data.phone && (
                <PersonalDataItem name="Phone" value={data.phone} />
            )}
            <PersonalDataItem name="Location" value={data.location} />
        </Box>
    );
}