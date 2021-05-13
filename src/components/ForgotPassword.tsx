import { Grid, Card, CardContent, Typography, TextField, Button, CardActions, makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useState } from 'react'
import { Link } from 'react-router-dom'
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

export default function ForgotPassword() {
    const classes = useStyles()
    const [email, setEmail] = useState("")
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: any) {
        e.preventDefault()
        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(email)
            setMessage('Check your inbox for further instructions')
        } catch (e) {
            setError('Failed to reset password')
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
                        <Typography variant="h5" component="h2">Reset Password</Typography>
                        <hr />
                        {error && <Alert severity="error">{error}</Alert>}
                        {message && <Alert severity="success">{message}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <TextField required type="email" onChange={(e) => setEmail(e.target.value)} label="Email" />
                            <Button variant="contained" color="primary" disabled={loading} type="submit" style={{ minWidth: "12em", marginTop: 6 }}>Reset Password</Button>
                        </form>
                        <Link to="/login">Log In</Link>
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
