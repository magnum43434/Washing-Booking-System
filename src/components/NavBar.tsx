import { IconButton, makeStyles, Menu, MenuItem, Box } from '@material-ui/core'
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory, useLocation } from 'react-router-dom'
import { AccountCircle } from '@material-ui/icons';


const useStyles = makeStyles({
    root: {
        width: "100vw",
        height: "5em",
        textAlign: "right",
    },
});

export default function NavBar() {
    const classes = useStyles();
    const history = useHistory()
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget); };
    const { currentUser, logout } = useAuth()

    const handleClose = (action: string) => {
        setAnchorEl(null);
        switch (action) {
            case "washingTime":
                return history.push("/")
            case "profile":
                return history.push("/profile")
            case "updateprofil":
                return history.push("/update-profile")
            default:
                break;
        }
    };

    async function handleLogout() {
        try {
            await logout()
            setAnchorEl(null);
            history.push("/login")
        } catch { }
    }

    return (
        <div className={classes.root}>
            {currentUser && <Box component="div" display="inline">
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><AccountCircle fontSize="large" /></IconButton>
            </Box>}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleClose("washingTime")}>Vasketider</MenuItem>
                <MenuItem onClick={() => handleClose("profile")}>Profile</MenuItem>
                <MenuItem onClick={() => handleClose("updateprofil")}>Ændre profil</MenuItem>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
            </Menu>
            { (!currentUser && location.pathname !== "/login") && <Link to="/login" style={{ marginRight: 3 }}>Log In</Link>}
        </div >
    )
}
