import { Box, Fab, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel } from "@mui/icons-material";
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import PersonalStudentDataDisplay from "./components/PersonalStudentDataDisplay";
import PersonalStudentDataEdit from "./components/PersonalStudentDataEdit";
import { styles } from "./components/styles";



export default function PersonalData({ personalData }) {
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [location, setLocation] = useState("");

    const handleSave = () => {
        if (editMode) {
            setEditMode(false)
            fetch('http://localhost:8080/api/student/update/1', { // TODO: change id and type of user
                method: 'PATCH',
                body: JSON.stringify({
                    firstName: (firstName ? firstName : null),
                    lastName: (lastName ? lastName : null),
                    email: (emailAddress ? emailAddress : null),
                    location: (location ? location : null)
                    // add fields 
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("ok");
                        //update personal data with context hook
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setEditMode(true)
            setFirstName("")
            setLastName("")
            setEmailAddress("")
            setLocation("")
        }
    }

    if (personalData) {
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
                    <PersonalStudentDataDisplay data={personalData} />
                ) : (
                    <PersonalStudentDataEdit
                        data={personalData}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        setEmailAddress={setEmailAddress}
                        setLocation={setLocation}
                    />
                )}

            </>
        );
    } else {
        return (
            <Box sx={styles.noInformationGlobalContainer}>
                <Typography variant='h4' sx={styles.typography}>
                    My personal information
                </Typography>
                <Box sx={styles.noInformationContainer}>
                    <Typography variant='h6' sx={styles.errorTypography}>
                        Error:
                    </Typography>
                    <Typography variant='h6' sx={styles.informationTypography}>
                        no information to display
                    </Typography>
                </Box>
            </Box>
        );
    }
}