import { createContext, useContext, useReducer, useEffect } from 'react';

export const UserContext = createContext(null);
export const UserDispatchContext = createContext(null);

const initialUser = {
    id: null,
    authenticated: false,
    token: '',
    role: '',
};


export function useUser() {
    return useContext(UserContext);
}

export function useUserDispatch() {
    return useContext(UserDispatchContext);
}

function userReducer(user, action) {

    switch (action.type) {
        case 'login': {
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...action.payload, authenticated: true };
        }
        case 'logout': {
            localStorage.clear();
            return initialUser;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function UserProvider({ children }) {
    const [tasks, dispatch] = useReducer(userReducer, initialUser);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/is-token-expired?token=${user.token}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
                .then(response => {
                    if (response.status != 200) {
                        dispatch({ type: 'logout' });
                    } else {
                        dispatch({ type: 'login', payload: user });
                    }
                })
        }
    }, []);


    return (
        <UserContext.Provider value={tasks}>
            <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}
