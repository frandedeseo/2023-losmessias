import { Box } from "@mui/material";
import PersonalDataItem from "./PersonalDataItem";
import { styles } from "../../../styles/personal-data-styles";

export default function PersonalDataDisplay({ data, isLoading }) {
    return (
        <Box sx={styles.container}>
            {data ? (
                <>
                    <PersonalDataItem name="First name" value={data.firstName} isLoading={isLoading} />
                    <PersonalDataItem name="Last name" value={data.lastName} isLoading={isLoading} />
                    <PersonalDataItem name="Email" value={data.email} isLoading={isLoading} />
                    <PersonalDataItem name="Location" value={data.location} isLoading={isLoading} />
                    <PersonalDataItem name="Phone" value={data.phone} isLoading={isLoading} />
                </>
            ) : (
                <>
                    <PersonalDataItem name="" value="" isLoading={isLoading} />
                    <PersonalDataItem name="" value="" isLoading={isLoading} />
                    <PersonalDataItem name="" value="" isLoading={isLoading} />
                    <PersonalDataItem name="" value="" isLoading={isLoading} />
                    <PersonalDataItem name="" value="" isLoading={isLoading} />
                </>
            )}
        </Box>
    );
}