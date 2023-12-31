import React, { useState, useContext } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/operation/';

export default function GetList() {
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [bankAccountData, setBankAccountData] = useState([]);
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
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>First Name</Table.HeaderCell>
                        <Table.HeaderCell>Last Name</Table.HeaderCell>
                        <Table.HeaderCell>Checked</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {bankAccountData.map((bankAccount) => {
                       return (
                         <Table.Row>
                            <Table.Cell>{bankAccount.bank.bank}</Table.Cell>
                          </Table.Row>
                     )})}
                </Table.Body>
            </Table>
        </div>
    )
}
}

