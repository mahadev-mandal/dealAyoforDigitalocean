import React from "react";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';

const AuthContext = React.createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = React.useState({ token: "" });
    const setUserAuthInfo = () => {
        const token = Cookies.get('token');
        setAuthState({ token });
    };
    //check if user is authenticated or not
    const isUserAuthenticated = () => {
        if (!authState.token) {
            return false;
        }
    };
    return (
        <Provider
            value={{
                authState,
                setAuthState: () => setUserAuthInfo(),
                isUserAuthenticated,
            }}
        >
            {children}
        </Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.elementType,
}

export { AuthContext, AuthProvider }

