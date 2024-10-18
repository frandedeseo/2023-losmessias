// context/ProfessorContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ProfessorContext = createContext();

export const useProfessor = () => useContext(ProfessorContext);

export function ProfessorProvider({ children }) {
    const [professorId, setProfessorId] = useState(null);

    // On component mount, read from localStorage
    useEffect(() => {
        const storedProfessorId = localStorage.getItem('professorId');
        if (storedProfessorId) {
            setProfessorId(storedProfessorId);
        }
    }, []);

    // Whenever professorId changes, write to localStorage
    useEffect(() => {
        if (professorId) {
            localStorage.setItem('professorId', professorId);
        } else {
            localStorage.removeItem('professorId');
        }
    }, [professorId]);

    return <ProfessorContext.Provider value={{ professorId, setProfessorId }}>{children}</ProfessorContext.Provider>;
}
