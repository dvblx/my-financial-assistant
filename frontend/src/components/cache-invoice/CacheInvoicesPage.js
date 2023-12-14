import React, { useState, useContext } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/cash-invoice/';

const CreateCacheInvoice = () => {
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [cacheInvoiceData, setCacheInvoiceData] = useState({});

    let postData = async(e) =>{
        let response = await fetch(`${API_URL}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body:JSON.stringify({'amount':e.target.amount.value, 'currency':e.target.currency.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setCacheInvoiceData(data)
        }
        }
    return (
        <div>
            <form onSubmit={postData}>
                <p><input type="number" name="amount" placeholder="Сумма" /></p>
                <p><select name='currency'>
                        <option value="RUB">Российский рубль</option>
                        <option value="BYN">Белорусский рубль</option>
                        <option value="KZT">Тенге</option>
                        <option value="USD">Доллар</option>
                        <option value="EUR">Евро</option>
                        <option value="CNY">Юань</option>
                        <option value="TRY">Турецкая лира</option>
                        <option value="DHS">Дирхам ОЭА</option>
                    </select></p>
                <p><input type="submit"/></p>
            </form>
        </div>
    )
}


export default CreateCacheInvoice




