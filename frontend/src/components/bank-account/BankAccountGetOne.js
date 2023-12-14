import React, { useState } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'

const API_URL = 'http://localhost:8000/api/bank-account/';

export default function GetOne() {
    const [bankAccountData, setBankAccountData] = useState({});
    let getMainPageData = async() =>{
        let response = await fetch(`${API_URL}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            setBankAccountData(data)
        }
    return (
        <div>
            <p>bankAccountData.bank.bank</p>
            <p>bankAccountData.bank.phone</p>
            <p>bankAccountData.bank.email</p>
        </div>
    )
}