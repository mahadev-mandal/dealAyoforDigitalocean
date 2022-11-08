import Cookies from 'js-cookie';
import React from 'react'
import { useMemo } from 'react';
import { createContext } from 'react'
import parseJwt from '../controllers/parseJwt';
import PropTypes from 'prop-types';

const UserContext = createContext();

function UserProvider({ children }) {
    const token = Cookies.get('token');
    const user = useMemo(() => parseJwt(token), [token]);
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;
export { UserContext };

UserProvider.propTypes = {
    children:PropTypes.array,
}