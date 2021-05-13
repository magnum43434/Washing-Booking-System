import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useDatabase from '../database/useDatabase'
import { Link } from 'react-router-dom'
import BookingTime from './BookingTime'
import TimeSlot from '../interfaces/TimeSlot'

export default function Profile() {
    const { readBookingDataAll } = useDatabase()
    const [allBookings, setallBookings] = useState<TimeSlot[]>()
    const { currentUser } = useAuth()
    console.log(allBookings);

    useEffect(() => {
        const fetch = async () => {
            let bookings: TimeSlot[] = []
            const snapshot = await readBookingDataAll().get()
            const data = snapshot.docs.map(doc => doc.data());
            data.map(doc => doc.data.map((bt: TimeSlot) => bookings.push(bt)))
            setallBookings(() => bookings.filter(bt => bt.data?.uid === currentUser.uid))
        }
        fetch()//eslint-disable-next-line
    }, [])

    return (
        <>
            {allBookings?.map(bt => {
                return <BookingTime key={bt.id} timeSlot={bt} />
            })}
            {/* <Container className="w-100">
                <div className="w-100 d-flex justify-content-center">
                    {errorMovie && <Alert variant="danger">{errorMovie}</Alert>}
                </div>
                <Row>
                    <Col style={{ borderRight: '1px solid gray' }}>
                        <Link to="/" className="w-100 btn btn-outline-dark mb-2">Back to Dashboard</Link>
                        <Card>
                            <Card.Body>
                                <h2 className="text-center mb-4">User Profile</h2>
                                <div className="d-flex justify-content-center">
                                    <img style={{ maxHeight: "200px", maxWidth: "200px" }} className="mb-2"
                                        src={currentUser.photoURL ? currentUser.photoURL : "https://s4.koustavwifi.in/2020/11/Error-404.png"} alt="profile pic" />
                                </div>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <h5><strong>Display name:</strong> {currentUser.displayName}</h5>
                                <h5><strong>Email:</strong> {currentUser.email}</h5>
                                <Link to="/update-profile" className="btn btn-outline-dark w-100 mt-3">Update Profile</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col style={{ borderRight: '1px solid gray' }}>
                        <h4 className="text-center">Watched list</h4>
                        <div style={{ overflow: 'auto', listStyle: 'none', maxHeight: "700px" }}>
                            {moviesWatched && moviesWatched.map((m, i) => {
                                return <SmallMovie key={m.id} movie={m} type="watched"
                                    removeMovie={() => handleRemoveMovie(m, "watched")}
                                />
                            })}
                        </div>
                    </Col>
                    <Col>
                        <h4 className="text-center">Watch list</h4>
                        <div style={{ overflow: 'auto', listStyle: 'none', maxHeight: "700px" }}>
                            {watchList && watchList.map((m, i) => {
                                return <SmallMovie key={m.id} movie={m} type="watch"
                                    addToWatched={() => handleAddToWatched(m, true)}
                                    removeMovie={() => handleRemoveMovie(m, "watch")}
                                />
                            })}
                        </div>
                    </Col>
                </Row>
            </Container> */}
        </>
    )
}
