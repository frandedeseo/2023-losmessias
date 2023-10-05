import { Box } from "@mui/material";
import PersonalItemEdit from "./PersonalItemEdit";
import { styles } from "./styles";

export default function PersonalDataEdit({ data, setFirstName, setLastName, setEmailAddress, setLocation, setPhone }) {
    return (
        <Box sx={styles.container}>
            <PersonalItemEdit name="First name" value={data.firstName} handleEdit={setFirstName} />
            <PersonalItemEdit name="Last name" value={data.lastName} handleEdit={setLastName} />
            <PersonalItemEdit name="Email" value={data.email} handleEdit={setEmailAddress} />
            <PersonalItemEdit name="Location" value={data.location} handleEdit={setLocation} />
            <PersonalItemEdit name="Phone" value={data.phone} handleEdit={setPhone} />
        </Box>
    );
}