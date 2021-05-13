import { Card, CardContent, makeStyles, Typography, Button, Grid, TextField, IconButton, ButtonGroup } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const useStyles = makeStyles({
    root: {
        maxWidth: "20em",
        textAlign: "center",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function UpdateProfile() {
    const classes = useStyles()
    const { currentUser, updateEmail, updatePassword, updateDisplayName } = useAuth()
    const [displayName, setDisplayName] = useState(currentUser.displayName)
    const [email, setEmail] = useState(currentUser.email)
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e: any) {
        e.preventDefault()
        if (password !== passwordConfirm) {
            return setError('Password do not match')
        }

        const promises = []
        setError('')
        setLoading(true)
        if (displayName !== currentUser.displayName) {
            promises.push(updateDisplayName(displayName))
        }
        if (email !== currentUser.email) {
            promises.push(updateEmail(email))
        }
        if (password) {
            promises.push(updatePassword(password))
        }

        Promise.all(promises).then(() => {
            history.push("/")
        }).catch(() => {
            setError('Failed to update account')
        }).finally(() => {
            setLoading(false)
        })
    }

    function handleGoBack() {
        history.push("/")
    }

    return (
        <>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="h2">Update Profile</Typography>
                        <hr />
                        {error && <Alert severity="error">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <TextField defaultValue={currentUser.displayName} type="text" onChange={(e) => setDisplayName(e.target.value)} label="Fulde navn"></TextField>
                            <TextField defaultValue={currentUser.email} type="email" onChange={(e) => setEmail(e.target.value)} label="Email" />
                            <TextField type="password" onChange={(e) => setPassword(e.target.value)} label="Adgangskode" />
                            <Typography style={{ fontSize: ".8rem" }}>Leave blank to keep the same</Typography>
                            <TextField type="password" onChange={(e) => setPasswordConfirm(e.target.value)} label="Gentag adgangskode" />
                            <Typography style={{ fontSize: ".8rem" }}>Leave blank to keep the same</Typography>
                            <ButtonGroup>
                                <IconButton onClick={() => handleGoBack()} color="primary"><ArrowBack /></IconButton>
                                <Button variant="contained" color="primary" disabled={loading} type="submit" style={{ minWidth: "12em", marginTop: 6 }}>Opdatere</Button>
                            </ButtonGroup>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}
