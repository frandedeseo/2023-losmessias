const { Typography, TextField } = require("@mui/material");

export default function PersonalItemEdit({ name, value }) {
    return <div style={{ flexDirection: "row", display: "flex" }}>
        <Typography
            variant='h6'
            sx={{
                margin: '1% 0% 1% 5%',
                fontWeight: "bold",
            }}
        >
            {name}:
        </Typography>

        <TextField
            variant="standard"
            defaultValue={value}
            sx={{
                margin: '1% 5% 1% 1%',
                fontStyle: "italic"
            }}
        />
    </div>;
}