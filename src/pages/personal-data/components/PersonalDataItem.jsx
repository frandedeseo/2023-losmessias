import { styles } from "../../../styles/personal-data-styles";

const { Typography } = require("@mui/material");

export default function PersonalDataItem({ name, value }) {
    return (
        <div style={{ flexDirection: "row", display: "flex" }}>
            <Typography
                variant='h6'
                sx={styles.itemTypography} >
                {name}:
            </Typography>

            <Typography
                variant='h6'
                sx={styles.itemInformation} >
                {value}
            </Typography>
        </div>);
}