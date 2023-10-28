import { styles } from "../../../styles/personal-data-styles";

const { Typography, Skeleton } = require("@mui/material");

export default function PersonalDataItem({ name, value, isLoading }) {
    return (
        <div style={{ flexDirection: "row", display: "flex" }}>
            {isLoading || (!name && !value) ? (
                <>
                    <Skeleton variant="text" width={100} height={35} sx={{ margin: '1% 0% 1% 5%' }} />
                    <Typography variant='h6' sx={{ marginTop: "1%" }} >
                        :
                    </Typography>
                    <Skeleton variant="text" width={200} height={35} sx={{ margin: '1% 5% 1% 1%' }} />
                </>
            ) :
                <>
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
                </>
            }
        </div>);
}