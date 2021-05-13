import React, { useState, useMemo, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    createStyles, Theme, TextField, ButtonGroup, Button, Tooltip, Snackbar,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import DataItem from './DataItem';
import TimeSlot from '../interfaces/TimeSlot';
import User from '../interfaces/User';
import { Cancel, Done, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import useDatabase from '../database/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import StartEndTimes from '../interfaces/StartEndTimes';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            maxHeight: "40em",
            border: "1px solid black",
            boxShadow: theme.shadows[5],
            ['@media (min-height:800px)']: { // eslint-disable-line no-useless-computed-key
                maxHeight: "45em"
            },
        },
        tableBody: {
            overflow: "scroll",
        },
        tableCell: {
            maxWidth: "11,11%",
            padding: theme.spacing(2, 0, 2),
        },
        tableCellTop: {
            maxWidth: "11,11%",
            padding: theme.spacing(2, 0, 2),
            fontSize: "1.2rem"
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    }));

const bookingTimes: StartEndTimes[] = [
    { "startTime": "06", "endTime": "08" },
    { "startTime": "08", "endTime": "10" },
    { "startTime": "10", "endTime": "12" },
    { "startTime": "12", "endTime": "14" },
    { "startTime": "14", "endTime": "16" },
    { "startTime": "16", "endTime": "18" },
    { "startTime": "18", "endTime": "20" },
    { "startTime": "20", "endTime": "22" },
]

export default function DataTable() {
    const classes = useStyles();
    const { writeBookingData, readBookingData } = useDatabase();
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const lastMonth = useRef(new Date().getMonth() - 1)
    const [Booking, setBooking] = useState<TimeSlot>()
    const [currentBookings, setCurrentBookings] = useState<TimeSlot[]>([])
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState("");
    const { currentUser } = useAuth()
    const [modalName, setDialogName] = useState(currentUser.displayName)
    const [modalApartment, setDialogApartment] = useState("")// eslint-disable-next-line
    const currentTable = useMemo(() => createTable(), [Booking, currentBookings])

    const handleMonth = (action: string) => {
        switch (action) {
            case "prev":
                if (currentMonth.getMonth() > lastMonth.current) {
                    return setCurrentMonth((prev) => new Date(Number(prev.getFullYear()), prev.getMonth() - 1))
                } else {
                    setErrorSnackbar(() => "Du kan ikke gå længere tilbage!")
                    return setOpenSnackbar(true)
                }
            case "next":
                return setCurrentMonth((prev) => new Date(Number(prev.getFullYear()), prev.getMonth() + 1))
            default:
                return setCurrentMonth(() => new Date())
        }
    }

    function handleBookingTime(e: any) {
        e.preventDefault();
        setOpenDialog(false);
        currentBookings.push(createData(
            Number(Booking?.x),
            Number(Booking?.y),
            bookingTimes[Number(Booking?.y) - 1],
            new Date(Number(currentMonth.getFullYear()), currentMonth.getMonth(), Number(Booking?.x) + 1,
                Number(bookingTimes[Number(Booking?.y) - 1].startTime)),
            currentMonth.toLocaleDateString('da-dk', { year: 'numeric', month: 'long' }).replace(' ', '_'),
            { uid: currentUser.uid, name: modalName, apartment: modalApartment }
        ))
        setDialogName("")
        setDialogApartment("")
        setBooking(undefined)
        writeBookingData(currentMonth.toLocaleDateString('da-dk', { year: 'numeric', month: 'long' }).replace(' ', '_'), currentBookings)
    }

    function handleCancellingTime(e: any) {
        e.preventDefault();
        setOpenDialogConfirm(false);
        let newCurrentBookings = currentBookings.filter((v) => v.id !== Booking?.id)
        setCurrentBookings(() => newCurrentBookings)
        setBooking(undefined)
        writeBookingData(currentMonth.toLocaleDateString('da-dk', { year: 'numeric', month: 'long' }).replace(' ', '_'), newCurrentBookings)
    }

    function OpenDialogBooking(booking: TimeSlot) {
        setBooking(booking)
        setDialogName(currentUser.displayName)
        setOpenDialog(true);
    }

    function OpenDialogConfirm(booking: TimeSlot) {
        setBooking(booking)
        setOpenDialogConfirm(true);
    }

    useEffect(() => {
        readBookingData(currentMonth.toLocaleDateString('da-dk', { year: 'numeric', month: 'long' }).replace(' ', '_')).get().then((doc) => {
            let data = doc.data()
            if (data === undefined) { return setCurrentBookings([]) }
            setCurrentBookings(data.data)
        }).catch((error) => {
            console.log("Error getting document:", error);
        });// eslint-disable-next-line
    }, [currentMonth])

    return (
        <>
            <TableContainer component={Paper} className={classes.table}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow >
                            <TableCell align="center" className={classes.tableCellTop}>
                                <ButtonGroup size="small" variant="text">
                                    <Tooltip arrow title="Tidligere måned"><Button onClick={() => handleMonth("prev")}><KeyboardArrowLeft /></Button></Tooltip>
                                    <Tooltip style={{ fontSize: "1rem" }} arrow title="Nuværende måned"><Button onClick={() => handleMonth("reset")}>{currentMonth.toLocaleDateString('da-dk', { year: 'numeric', month: 'short' })}</Button></Tooltip>
                                    <Tooltip arrow title="Næste måned"><Button onClick={() => handleMonth("next")}><KeyboardArrowRight /></Button></Tooltip>
                                </ButtonGroup>
                            </TableCell>
                            {bookingTimes.map(bt => {
                                return <TableCell align="center" className={classes.tableCellTop}>{`${bt.startTime} - ${bt.endTime}`}</TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {currentTable}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Book tid</DialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <form autoComplete="off">
                        <TextField
                            autoFocus
                            required
                            label="Navn"
                            onChange={(e) => setDialogName(e.target.value)}
                            value={modalName}
                            margin="dense"
                            fullWidth
                        />
                        <TextField
                            label="Lejlighed nr"
                            onChange={(e) => setDialogApartment(e.target.value)}
                            value={modalApartment}
                            margin="dense"
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => handleBookingTime(e)} startIcon={<Done color="action" />}>Book</Button>
                    <Button onClick={() => setOpenDialog(false)} endIcon={<Cancel color="error" />}>Tilbage</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity="error">{errorSnackbar}</Alert>
            </Snackbar>
            <Dialog
                open={openDialogConfirm}
                onClose={() => setOpenDialogConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Annullering af vasketid</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Er du sikker på at du vil annullere din vasketid?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => handleCancellingTime(e)}>Ja</Button>
                    <Button onClick={() => setOpenDialogConfirm(false)}>Nej</Button>
                </DialogActions>
            </Dialog>
        </>
    );

    function createData(x: number, y: number, startEndTimes?: StartEndTimes, date?: Date, bookingMonth?: string, data?: User) {
        let id = Math.random().toString(36).substr(2, 9)// eslint-disable-next-line
        while (currentBookings.find(v => v.id === id)) {
            id = Math.random().toString(36).substr(2, 9)
        }
        return { id, x, y, startEndTimes, date, bookingMonth, data };
    }

    function createTable() {
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();
        const daysInMonth = new Date(year, month, 0).getDate();
        const array = new Array(daysInMonth).fill(0).map(() => new Array(9).fill(0));
        currentBookings.map((ts: TimeSlot) => array[ts.x][ts.y] = ts)

        for (let x = 0; x < daysInMonth; x++) {
            array[x][0] = new Date(year, currentMonth.getMonth(), x + 1).toLocaleDateString('da-dk', { year: 'numeric', month: 'short', day: '2-digit' })
        }

        const returnArray = []
        for (let x = 0; x < array.length; x++) {
            let tempRow = []
            for (let y = 0; y < array[x].length; y++) {
                if (array[x][y] === 0) { array[x][y] = createData(x, y) }
                if (y === 0) {
                    tempRow.push(<TableCell align="center" className={classes.tableCell} style={{ textDecoration: "underline" }} key={`${x}, ${y}`}><strong>{array[x][y]}</strong></TableCell>)
                } else {
                    tempRow.push(<TableCell align="center" className={classes.tableCell} key={`${x}, ${y}`}><DataItem cancelTime={(data: TimeSlot) => OpenDialogConfirm(data)} bookTime={(data: TimeSlot) => OpenDialogBooking(data)} timeSlot={array[x][y]} /></TableCell>)
                }
            }
            returnArray.push(<TableRow hover key={x}>{tempRow.map((cell) => (cell))}</TableRow>)
        }
        return returnArray
    }
}