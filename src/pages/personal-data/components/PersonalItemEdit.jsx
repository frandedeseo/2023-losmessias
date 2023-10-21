import { useState } from "react";
import { styles } from "../../../styles/personal-data-styles";

const { Typography, TextField } = require("@mui/material");

export default function PersonalItemEdit({ name, value, handleEdit }) {
    const [tempValue, setTempValue] = useState(value);
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
                onChange={(e) => {
                    handleEdit(e.target.value)
                    setTempValue(e.target.value)
                }}
                error={tempValue === ""}
                helperText={tempValue === "" ? "This field is required" : ""}
            />
        </div>
    );
}