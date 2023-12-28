import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api';

const HomePage = () => {
    let [mainPageData, setMainPageData] = useState({})
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getMainPageData()
    }, [])


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
            setMainPageData(data)
        }

    }

    return (
        <div>
            <p>Главная страница</p>
            <p>Зарегистрированные продукты банков: {mainPageData.current_user_bank_products}</p>
            <p>Финансовые цели: {mainPageData.current_user_financial_goals}</p>
            <p>Наличные счета: {mainPageData.current_user_cash_invoices}</p>
            <p>Регулярные траты: {mainPageData.current_user_regular_spends}</p>
        </div>
    )
}

export default HomePage