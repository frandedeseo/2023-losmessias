import { Box, Fab, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel } from "@mui/icons-material";
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import PersonalStudentDataDisplay from "./components/PersonalStudentDataDisplay";
import PersonalStudentDataEdit from "./components/PersonalStudentDataEdit";
import { styles } from "./components/styles";
import { useUser, useUserDispatch } from "@/context/UserContext";
import useSWR from "swr";



export default function PersonalData() {
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [location, setLocation] = useState("");
    const fetcher = async (url) => {
        try {
            const res = await fetch(url);
            return res.json();
        } catch (error) {
            console.log(error);
        }
    }
    const user = useUser();
    const { data: studentData, isLoading, mutate } = useSWR(`http://localhost:8080/api/student/${user.id}`, fetcher);

    const handleSave = () => {
        if (editMode) {
            setEditMode(false)
            fetch(`http://localhost:8080/api/${user.role}/update/${user.id}`, { // TODO: change id and type of user
                method: 'PATCH',
                body: JSON.stringify({
                    firstName: (firstName ? firstName : null),
                    lastName: (lastName ? lastName : null),
                    email: (emailAddress ? emailAddress : null),
                    location: (location ? location : null)
                    // add field phone
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
                    <PersonalStudentDataDisplay data={studentData} />
                ) : (
                    <PersonalStudentDataEdit
                        data={studentData}
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
                    LOADING...
                </Typography>

            </Box>
        );
    }
}