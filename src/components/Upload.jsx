import { useUser } from '@/context/UserContext';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Upload() {

    const user = useUser();
    const [uploadedInfo, setUploadedInfo] = useState({});

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const onFileChange = event => {

        const myFile = event.target.files[0];
        const data = new FormData();
        data.append("file", myFile);
        console.log(data);
        console.log(event.target.files[0]);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/uploadFile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.token}`,
            },
            body: data

        })
            .then(res =>
                res.json().then(json => {
                    setUploadedInfo(json);
                })
            );
    }

    return (
        <Box>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput type="file" onChange={onFileChange} />
                <TextField sx={{ pl: 3 }}>{uploadedInfo}</TextField>
            </Button>
        </Box>
    );
}