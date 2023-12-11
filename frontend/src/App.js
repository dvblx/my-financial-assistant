import './App.css';
import AuthProvider from './context/AuthContext'
import { useState, useEffect } from 'react';
import HomePage from './components/homepage/HomePage'
import Header from './components/Header'
import { jwtDecode } from "jwt-decode";


function App() {
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
  let [loading, setLoading] = useState(true)

  let loginUser = async (e)=> {
      e.preventDefault()
       fetch(process.env.REACT_APP_API_KEY, {
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
      }).then((response) => {
        if(response.status === 200){
          response.json().then((data) => {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            window.location.pathname = '/'
          })
      }else{
          alert('Something went wrong!')
      }
      }).catch((error) => console.log(error))
  }


  let logoutUser = () => {
      setAuthTokens(null)
      setUser(null)
      localStorage.removeItem('authTokens')
      window.location.pathname = '/login'
  }


  let updateToken = async ()=> {

      fetch(`${process.env.REACT_APP_API_KEY}refresh/`, {
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body:JSON.stringify({'refresh':authTokens?.refresh})
      }).then((response) => {
        if (response.status === 200){
          response.json().then((data) => {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
          })
      }else{
          logoutUser()
      }
      if(loading){
          setLoading(false)
      }
      }).catch((err) => console.log(err))
  }

  useEffect(()=> {

      if(loading){
          updateToken()
      }

      let fourMinutes = 1000 * 60 * 4

      let interval =  setInterval(()=> {
          if(authTokens){
              updateToken()
          }
      }, fourMinutes)
      return ()=> clearInterval(interval)

  }, [authTokens, loading])
  let contextData = {
    user:user,
    authTokens:authTokens,
    loginUser:loginUser,
    logoutUser:logoutUser,
}
  return (
    <div className="App">
    <AuthProvider.Provider value={contextData}>
       <Header/>
    </AuthProvider.Provider>
    <HomePage/>
    </div>
  );
}

export default App;