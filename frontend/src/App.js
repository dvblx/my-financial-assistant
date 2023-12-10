import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import AuthProvider from './context/AuthContext'

import HomePage from './components/homepage/HomePage'
import LoginPage from './components/reg&auth/LoginPage'
import RegistrationPage from './components/reg&auth/RegistrationPage'
import BankAccountsPage from './components/bank-account/BankAccountsPage'
import CacheInvoicesPage from './components/cache-invoice/CacheInvoicesPage'
import OperationsPagePage from './components/operation/OperationsPagePage'
import PersonalPage from './components/user-profile/PersonalPage'
import FinancialGoalsPage from './components/financial-goal/FinancialGoalsPage'
import RegularSpendsPage from './components/regular-spending/RegularSpendsPage'
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header/>
          <PrivateRoute component={HomePage} path="/" exact/>
          <PrivateRoute component={PersonalPage} path="/personal" exact/>
          <PrivateRoute component={BankAccountsPage} path="/bank-accounts" exact/>
          <PrivateRoute component={CacheInvoicesPage} path="/cache-invoices" exact/>
          <PrivateRoute component={OperationsPagePage} path="/operations" exact/>
          <PrivateRoute component={FinancialGoalsPage} path="/financial-goals" exact/>
          <PrivateRoute component={RegularSpendsPage} path="/regular-spends" exact/>
          <Route component={LoginPage} path="/login"/>
          <Route component={RegistrationPage} path="/register"/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;