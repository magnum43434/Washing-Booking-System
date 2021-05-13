import { Card, CardContent, makeStyles, Typography, Button, CardActions, Grid, TextField } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const useStyles = makeStyles({
    root: {
        maxWidth: "15em",
        textAlign: "center",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function Login() {
    const classes = useStyles();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e: any) {
        e.preventDefault()
        try {
            setError('')
            setLoading(true)
            await login(email, password)
            history.push("/")
        } catch (e) {
            setError('Failed to sign in')
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
                        <Typography variant="h5" component="h2">Log In</Typography>
                        <hr />
                        {error && <Alert severity="error">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <TextField required type="email" onChange={(e) => setEmail(e.target.value)} label="Email" />
                            <TextField required type="password" onChange={(e) => setPassword(e.target.value)} label="Password" />
                            <Button variant="contained" color="primary" disabled={loading} type="submit" style={{ minWidth: "12em", marginTop: 6 }}>Login</Button>
                        </form>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </CardContent>
                    <hr />
                    <CardActions>
                        Need an account?<Link to="/signup">Sign Up</Link >
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}
