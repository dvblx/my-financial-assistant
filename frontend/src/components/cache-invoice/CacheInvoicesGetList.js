import React, { useState } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/cash-invoice/';

const GetCacheInvoices = () => {
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [cacheInvoiceData, setCacheInvoiceData] = useState([]);
    let getCacheInvoices = async() =>{
        let response = await fetch(`${API_URL}`, {
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
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Last Name</Table.HeaderCell>
                        <Table.HeaderCell>Checked</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {cacheInvoiceData.map((cacheInvoice) => {
                       return (
                         <Table.Row>
                            <Table.Cell>{cacheInvoice.amount}</Table.Cell>
                            <Table.Cell>{cacheInvoice.currency}</Table.Cell>
                          </Table.Row>
                     )})}
                </Table.Body>
            </Table>
        </div>
    )
}
}

export default GetCacheInvoices