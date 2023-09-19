import { AccessTime, Business, MailOutline, Phone } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, CardMedia, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

export default function ProfessorCard({ name, email, phone, office, officeHours, image, style }) {
    return (
        <Card sx={{ maxWidth: 350, ...style }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image="https://www.w3schools.com/howto/img_avatar.png"
                    alt="Professor"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <MailOutline />
                            </ListItemIcon>
                            <Typography variant="body1" color="text.secondary">
                                {email}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Phone />
                            </ListItemIcon>
                            <Typography variant="body1" color="text.secondary">
                                {phone}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Business />
                            </ListItemIcon>
                            <Typography variant="body1" color="text.secondary">
                                {office}
                            </Typography>
                        </ListItem>
                        {officeHours && (
                            <ListItem>
                                <ListItemIcon>
                                    <AccessTime />
                                </ListItemIcon>
                                <Typography variant="body1" color="text.secondary">
                                    {officeHours}hs
                                </Typography>
                            </ListItem>
                        )}

                    </List>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}