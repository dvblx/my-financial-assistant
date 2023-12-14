import React, { useState, useContext } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/bank-account/';

export default function Create() {
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [bankAccountData, setBankAccountData] = useState({});

    return (
        <div>

        </div>
    )
}




