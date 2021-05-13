import React from 'react'
import { Card, CardHeader, CardContent, createStyles, makeStyles, Theme, Paper } from '@material-ui/core'
import TimeSlot from '../interfaces/TimeSlot';

interface IProp {
    timeSlot: TimeSlot,

}

function toDateTime(secs: any) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(Number(secs.seconds));
    return t;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
            marginBottom: ".5rem"
        },
    }),
);

export default function BookingTime(props: IProp) {
    const classes = useStyles();

    console.log(props.timeSlot);

    return (
        <>
            <Paper className={classes.root} elevation={3} variant="elevation">
                <Card>
                    <CardHeader
                        title={`${props.timeSlot.startEndTimes?.startTime}:00 -> ${props.timeSlot.startEndTimes?.endTime}:00`}
                        subheader={toDateTime(props.timeSlot.date).toLocaleDateString('da-dk', { year: 'numeric', month: 'short', day: '2-digit' })} />
                    <CardContent></CardContent>
                </Card>
            </Paper>
        </>
    )
}
