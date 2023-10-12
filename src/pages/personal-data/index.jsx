import { Box, Fab, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel } from "@mui/icons-material";
import { useState } from "react";
import PersonalDataDisplay from "./components/PersonalDataDisplay";
import PersonalDataEdit from "./components/PersonalDataEdit";
import { styles } from "./components/styles";
import { useUser } from "@/context/UserContext";
import useSWR from "swr";
import { fetcher } from "@/helpers/FetchHelpers";



export default function PersonalData() {
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const user = useUser();
    const { data: studentData, isLoading, mutate } = useSWR(`http://localhost:8080/api/${user.role}/${user.id}`, fetcher);

    const handleSave = () => {
        if (editMode) {
            setEditMode(false)
            fetch(`http://localhost:8080/api/${user.role}/update/${user.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    firstName: (firstName ? firstName : null),
                    lastName: (lastName ? lastName : null),
                    email: (emailAddress ? emailAddress : null),
                    location: (location ? location : null),
                    phone: (phone ? phone : null)
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((res) => res.json())
                .then((response) => mutate(response))
                .catch((err) => console.log(err));
        } else {
            setEditMode(true)
            setFirstName("")
            setLastName("")
            setEmailAddress("")
            setLocation("")
            setPhone("")
        }
    }

    if (!isLoading) {
        return (
            <>
                <Box sx={styles.globalContainer}>
                    <Typography variant='h4' sx={styles.typography}>
                        My personal information
                    </Typography>
                    {editMode ? (
                        <Box>
                            <Fab
                                color="error"
                                aria-label="edit"
                                onClick={() => setEditMode(false)}
                                style={{ marginRight: "1rem" }}
                            >
                                <Cancel />
                            </Fab>
                            <Fab
                                color="success"
                                aria-label="edit"
                                onClick={() => handleSave()}
                            >
                                <CheckIcon />
                            </Fab>
                        </Box>
                    ) : (
                        <>
                            <Fab
                                color={"primary"}
                                aria-label="edit"
                                onClick={() => handleSave()}
                            >
                                {editMode ? <CheckIcon /> : (<EditIcon />)}
                            </Fab>
                        </>
                    )}
                </Box>
                {!editMode ? (
                    <PersonalDataDisplay data={studentData} />
                ) : (
                    <PersonalDataEdit
                        data={studentData}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        setEmailAddress={setEmailAddress}
                        setLocation={setLocation}
                        setPhone={setPhone}
                    />
                )}

            </>
        );
    } else {
        return (
            <Box sx={styles.noInformationGlobalContainer}>
                <Typography variant='h4' sx={styles.typography}>
                    LOADING...
                </Typography>

            </Box>
        );
    }
}