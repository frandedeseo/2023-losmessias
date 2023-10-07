import { styles } from "./styles";

const { Typography, TextField } = require("@mui/material");

export default function PersonalItemEdit({ name, value, handleEdit }) {
    return (
        <div style={{ flexDirection: "row", display: "flex" }}>
            <Typography
                variant='h6'
                sx={styles.itemTypography}
            >
                {name}:
            </Typography>

            <TextField
                variant="standard"
                defaultValue={value}
                sx={styles.itemEditTextField}
                onChange={(e) => handleEdit(e.target.value)}
            />
        </div>);
}