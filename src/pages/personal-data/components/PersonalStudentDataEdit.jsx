import { Box } from "@mui/material";
import PersonalItemEdit from "./PersonalItemEdit";

export default function PersonalStudentDataEdit({ data }) {
    return (
        <Box sx={{ flexDirection: "column", display: "flex" }}>
            <PersonalItemEdit name="First name" value={data.firstName} />
            <PersonalItemEdit name="Last name" value={data.lastName} />
            <PersonalItemEdit name="Email" value={data.email} />
            <PersonalItemEdit name="Location" value={data.location} />
        </Box>
    );
}