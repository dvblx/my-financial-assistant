import React, { useState } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/cash-invoice/';

const GetCacheInvoice = id => {
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [cacheInvoiceData, setCacheInvoiceData] = useState({});
    let getMainPageData = async() =>{
        let response = await fetch(`${API_URL}${id}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            setCacheInvoiceData(data)
        }
    return (
        <div>
            <p>cacheInvoiceData.amount</p>
            <p>cacheInvoiceData.currency</p>
        </div>
    )
}

export default GetCacheInvoice