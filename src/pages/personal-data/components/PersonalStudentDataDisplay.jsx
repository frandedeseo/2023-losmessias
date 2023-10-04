import { Box } from "@mui/material";
import PersonalDataItem from "./PersonalDataItem";

export default function PersonalStudentDataDisplay({ data }) {
    return (
        <Box>
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