import { createContext, useContext, useReducer } from 'react';

export const UserContext = createContext(null);
export const UserDispatchContext = createContext(null);

const initialUser = {
    id: null,
    authenticated: false,
    role: '',
};

export function useUser() {
    return useContext(UserContext);
}

export function useUserDispatch() {
    return useContext(UserDispatchContext);
}

function userReducer(user, action) {
    console.log(action);
    switch (action.type) {
        case 'login': {
            return { ...action.payload, authenticated: true };
        }
        case 'logout': {
            return initialUser;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function UserProvider({ children }) {
    const [tasks, dispatch] = useReducer(userReducer, initialUser);

    return (
        <UserContext.Provider value={tasks}>
            <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}
