import { Box, Fab, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PersonalDataDisplay from "./components/PersonalDataDisplay";
import PersonalDataEdit from "./components/PersonalDataEdit";
import { styles } from "../../styles/personal-data-styles";
import { useUser } from "@/context/UserContext";
import useSWR from "swr";
import { fetcherGetWithToken } from "@/helpers/FetchHelpers";
import LoadingModal from "@/components/modals/LoadingModal";
import { useRouter } from "next/router";



export default function PersonalData() {
    const [editMode, setEditMode] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        console.log(user);
        if (user.token!=undefined){ 
            if (!user.authenticated){
                router.push('/');
            }
        }
    }, [router, user])


    const { data, isLoading, mutate } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/${user.role}/${user.id}`, user.token],
        fetcherGetWithToken);

    const handleSave = () => {
        if (editMode) {
            setEditMode(false)
            setIsProcessing(true)
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/${user.role}/update/${user.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    email: (emailAddress ? emailAddress : null),
                    location: (location ? location : null),
                    phone: (phone ? phone : null)
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${user.token}`
                },
            })
                .then((res) => {
                    if (!res.ok) throw Error(res.status);
                    res.json()
                })
                .then((response) => mutate(response))
                .catch((err) => console.log(err)).finally(() => setIsProcessing(false));
        } else {
            setEditMode(true)
            setEmailAddress("")
            setLocation("")
            setPhone("")
        }
    }


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
                <PersonalDataDisplay data={data} isLoading={isLoading} />
            ) : (
                <PersonalDataEdit
                    data={data}
                    setEmailAddress={setEmailAddress}
                    setLocation={setLocation}
                    setPhone={setPhone}
                />
            )}
            <LoadingModal isOpen={isProcessing} message={'Processing changes...'} />
        </>
    );
}