import { Typography } from "@mui/material";
import { useApi } from "../hooks/useApi";
import { useEffect } from "react";

function PersonalItem({ name, value }) {
    return <div style={{ flexDirection: "row", display: "flex" }}>
        <Typography
            variant='h6'
            sx={{ margin: '1% 0% 1% 5%' }}
        >
            {name}:
        </Typography>

        <Typography
            variant='h6'
            sx={{
                margin: '1% 5% 1% 1%',
                fontStyle: "italic",
            }}>
            {value}
        </Typography>
    </div>;
}


export default function PersonalData() {
    const { data, getStudentById } = useApi();
    useEffect(() => {
        getStudentById(1);
    }, [])
    console.log(data);

    return (
        <>
            <Typography variant='h4' sx={{ margin: '2% 5%' }}>
                My personal information
            </Typography>
            <div>
                <PersonalItem name="First name" value={data.firstName} />

                <PersonalItem name="Last name" value={data.lastName} />

                <PersonalItem name="Email" value={data.email} />

                {data.phone && (
                    <PersonalItem name="Phone" value={data.phone} />
                )}

                <PersonalItem name="Location" value={data.location} />
            </div>

        </>
    );
}