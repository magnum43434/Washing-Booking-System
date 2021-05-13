import StartEndTimes from "./StartEndTimes";
import User from "./User";

export default interface TmeSlot {
    id: string,
    x: number,
    y: number,
    startEndTimes?: StartEndTimes,
    date?: Date,
    bookingMonth?: string,
    data?: User
}