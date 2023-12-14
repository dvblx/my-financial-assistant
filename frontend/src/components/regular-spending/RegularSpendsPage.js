import React, { useState, useContext } from 'react';
import { Button, Checkbox, Form, Table } from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/regular-spending/';

const CreateCacheInvoice = () => {
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [regularSpendingData, setRegularSpendingData] = useState({});

    let postData = async(e) =>{
    console.log(JSON.stringify({'spending_name':e.target.spending_name.value, 'amount':e.target.amount.value,
             'currency':e.target.currency.value, 'period_count':e.target.period_count.value,
              'period': e.target.period.value, 'payment_url': e.target.payment_url.value}))
        let response = await fetch(`${API_URL}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body:JSON.stringify({'spending_name':e.target.spending_name.value, 'amount':e.target.amount.value,
             'currency':e.target.currency.value, 'period_count':e.target.period_count.value,
              'period': e.target.period.value, 'payment_url': e.target.payment_url.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setRegularSpendingData(data)
        }
        }
    return (
        <div>
            <form onSubmit={postData}>
                <p><input type="text" name="spending_name" placeholder="Название траты" /></p>
                <p><input type="number" name="amount" placeholder="Сумма" /></p>

                <p><input type="text" name="payment_url" placeholder="Ссылка на оплату" /></p>
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
                <p><input type="number" name="period_count" placeholder="Период (число)" /></p>
                <p><select name='period'>
                        <option value="DY">дни</option>
                        <option value="WK">недели</option>
                        <option value="MH">месяц</option>
                        <option value="YR">год</option>
                    </select></p>
                <p><input type="submit"/></p>
            </form>
        </div>
    )
}


export default CreateCacheInvoice