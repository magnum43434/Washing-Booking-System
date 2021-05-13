import { Card, CardContent, makeStyles, Typography, Button, CardActions, Grid, TextField } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
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

export default function Signup() {
    const classes = useStyles();
    const [email, setEmail] = useState("")
    const [fullName, setFullName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e: any) {
        e.preventDefault()
        if (password !== passwordConfirm) {
            return setError('Password do not match')
        }
        try {
            setError('')
            setLoading(true)
            await signup(email, password, fullName)
            history.push("/")
        } catch (e) {
            setError('Failed to create an account')
        }

        setLoading(false)
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
                        <Typography variant="h5" component="h2">Sign Up</Typography>
                        <hr />
                        {error && <Alert severity="error">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <TextField required type="text" onChange={(e) => setFullName(e.target.value)} label="Fulde navn" />
                            <TextField required type="email" onChange={(e) => setEmail(e.target.value)} label="Email" />
                            <TextField required type="password" onChange={(e) => setPassword(e.target.value)} label="Password" />
                            <TextField required type="password" onChange={(e) => setPasswordConfirm(e.target.value)} label="Confirm password" />
                            <Button variant="contained" color="primary" disabled={loading} type="submit" style={{ minWidth: "12em", marginTop: 6 }}>Login</Button>
                        </form>
                    </CardContent>
                    <hr />
                    <CardActions>
                        Already have an account? <Link to="/login">Log In</Link>
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}
