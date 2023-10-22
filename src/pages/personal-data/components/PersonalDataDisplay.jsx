import { Box } from "@mui/material";
import PersonalDataItem from "./PersonalDataItem";
import { styles } from "../../../styles/personal-data-styles";

export default function PersonalDataDisplay({ data }) {
    return (
        <Box sx={styles.container}>
            {data ? (
                <>
                    <PersonalDataItem name="First name" value={data.firstName} />
                    <PersonalDataItem name="Last name" value={data.lastName} />
                    <PersonalDataItem name="Email" value={data.email} />
                    <PersonalDataItem name="Location" value={data.location} />
                    <PersonalDataItem name="Phone" value={data.phone} />
                </>
            ) : (
                <PersonalDataItem name="Loading..." value="Loading..." />
            )}
        </Box>
    );
}