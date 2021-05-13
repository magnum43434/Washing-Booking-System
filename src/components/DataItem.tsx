import { Button, Paper, Typography, Grid, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { BookmarkBorderOutlined } from '@material-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import TimeSlot from '../interfaces/TimeSlot';
import DeleteForeverIcon from '@material-ui/icons/DeleteForeverOutlined';

interface IProp {
    timeSlot: TimeSlot,
    bookTime: Function,
    cancelTime: Function
}

const useStyles = makeStyles({
    DataItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px dashed black',
        minHeight: '3rem',
        maxHeight: '3rem',
        margin: ".2rem",
        padding: 0
    },
    BookButton: {
        margin: 0,
        width: '100%',
    },
    CancelButton: {
        margin: 2,
        width: '100%',
    },
    grid: {
        padding: 0,
        margin: 0,
        textAlign: "center"
    },
    gridTitle: {
        textDecoration: "underline",
        wordWrap: "break-word",
        maxWidth: "9em",
        textAlign: "center"
    }
})

export default function DataItem(props: IProp) {
    const classes = useStyles();
    const { currentUser } = useAuth()


    if (props.timeSlot.data === undefined) {
        return (
            <Paper className={classes.DataItem}>
                <Button startIcon={<BookmarkBorderOutlined />} onClick={() => props.bookTime(props.timeSlot)} className={classes.BookButton} variant="text">Book tid</Button>
            </Paper>
        )
    } else {
        return (
            <Paper className={classes.DataItem}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column">
                            <Grid item className={classes.gridTitle} xs>
                                <Typography className={classes.grid} variant="caption">{props.timeSlot.data.name}</Typography>
                            </Grid>

                        </Grid>
                        {currentUser.uid === props.timeSlot.data.uid && <Grid item>
                            <Tooltip arrow title="Annullere tid">
                                <DeleteForeverIcon fontSize="small" onClick={() => props.cancelTime(props.timeSlot)} />
                            </Tooltip>
                        </Grid>}
                    </Grid>
                </Grid>
            </Paper>
        )
    }

}