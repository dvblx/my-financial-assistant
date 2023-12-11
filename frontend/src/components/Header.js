import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../utils/PrivateRoute'
import HomePage from './homepage/HomePage'
import LoginPage from './reg&auth/LoginPage'
import RegistrationPage from './reg&auth/RegistrationPage'
import BankAccountsPage from './bank-account/BankAccountsPage'
import CacheInvoicesPage from './cache-invoice/CacheInvoicesPage'
import OperationsPage from './operation/OperationsPage'
import PersonalPage from './user-profile/PersonalPage'
import FinancialGoalsPage from './financial-goal/FinancialGoalsPage'
import RegularSpendsPage from './regular-spending/RegularSpendsPage'
export default function Header() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoute><HomePage /></PrivateRoute>}path="/"exact/>
                <Route element={<PrivateRoute><PersonalPage /></PrivateRoute>} path="/personal" exact/>
                <Route element={<PrivateRoute><BankAccountsPage /></PrivateRoute>} path="/bank-accounts" exact/>
                <Route element={<PrivateRoute><CacheInvoicesPage /></PrivateRoute>} path="/cache-invoices" exact/>
                <Route element={<PrivateRoute><OperationsPage /></PrivateRoute>} path="/operations" exact/>
                <Route element={<PrivateRoute><FinancialGoalsPage /></PrivateRoute>} path="/financial-goals" exact/>
                <Route element={<PrivateRoute><RegularSpendsPage /></PrivateRoute>} path="/regular-spends" exact/>
                <Route element={<LoginPage />} path="/login"/>
                <Route element={<RegistrationPage />} path="/register"/>
            </Routes>
       </BrowserRouter>
    );
}

// import React from "react";
//
// const Header = () => {
//     return <></>
// }
//
// export default  Header;