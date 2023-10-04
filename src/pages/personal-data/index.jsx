import { Box, Fab, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import PersonalStudentDataDisplay from "./components/PersonalStudentDataDisplay";
import PersonalStudentDataEdit from "./components/PersonalStudentDataEdit";



export default function PersonalData({ personalData }) {
    const [editMode, setEditMode] = useState(false);
    if (personalData) {
        return (
            <>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mr: 3,

                }}>
                    <Typography variant='h4' sx={{ margin: '2% 3%' }}>
                        My personal information
                    </Typography>
                    <Fab
                        color={!editMode ? "primary" : "success"}
                        aria-label="edit"
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? <CheckIcon /> : <EditIcon />}
                    </Fab>
                </Box>
                {!editMode ? (
                    <PersonalStudentDataDisplay data={personalData} />
                ) : (
                    <PersonalStudentDataEdit data={personalData} />
                )}

            </>
        );
    } else {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "space-between",
                mr: 3,

            }}>
                <Typography variant='h4' sx={{ margin: '2% 3%' }}>
                    My personal information
                </Typography>
                <Box sx={{ flexDirection: "row", display: "flex" }}>
                    <Typography variant='h6' sx={{ marginLeft:"3%", fontStyle: "italic", color: 'red' }}>
                        Error:
                    </Typography>
                    <Typography variant='h6' sx={{ marginLeft: '1%', fontStyle: "italic" }}>
                        no information to display
                    </Typography>
                </Box>
            </Box>
        );
    }
}