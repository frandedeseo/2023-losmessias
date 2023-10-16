import { Box } from "@mui/material";
import PersonalItemEdit from "./PersonalItemEdit";
import { styles } from "./styles";
import PersonalDataItem from "./PersonalDataItem";

export default function PersonalDataEdit({ data, setEmailAddress, setLocation, setPhone }) {
    return (
        <Box sx={styles.container}>
            <PersonalDataItem name="First name" value={data.firstName} />
            <PersonalDataItem name="Last name" value={data.lastName} />
            <PersonalItemEdit name="Email" value={data.email} handleEdit={setEmailAddress} />
            <PersonalItemEdit name="Location" value={data.location} handleEdit={setLocation} />
            <PersonalItemEdit name="Phone" value={data.phone} handleEdit={setPhone} />
        </Box>
    );
}