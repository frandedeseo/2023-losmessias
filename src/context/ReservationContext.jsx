// context/ReservationContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

export const useReservation = () => useContext(ReservationContext);

export function ReservationProvider({ children }) {
    const [reservationId, setReservationId] = useState(null);
    const [userId, setUserId] = useState(null);

    // On component mount, read from localStorage
    useEffect(() => {
        const storedReservationId = localStorage.getItem('reservationId');
        const storedUserId = localStorage.getItem('reservationUserId');
        if (storedReservationId) {
            setReservationId(storedReservationId);
        }
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Whenever reservationId or userId changes, write to localStorage
    useEffect(() => {
        if (reservationId) {
            localStorage.setItem('reservationId', reservationId);
        } else {
            localStorage.removeItem('reservationId');
        }

        if (userId) {
            localStorage.setItem('reservationUserId', userId);
        } else {
            localStorage.removeItem('reservationUserId');
        }
    }, [reservationId, userId]);

    return (
        <ReservationContext.Provider value={{ reservationId, setReservationId, userId, setUserId }}>{children}</ReservationContext.Provider>
    );
}
