import TimeSlot from '../interfaces/TimeSlot'
import { database } from './firebase'

export default function useDatabase() {
    function writeBookingData(month: string, data: TimeSlot[]) {
        database.collection('bookings').doc(month).set({ data })
    }

    function readBookingData(month: string) {
        return database.collection('bookings').doc(month);
    }

    function readBookingDataAll() {
        return database.collection('bookings');
    }

    return {
        writeBookingData,
        readBookingData,
        readBookingDataAll
    }
}