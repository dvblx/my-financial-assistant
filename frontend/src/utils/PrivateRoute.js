import { Route, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({children}) => {
    let {user} = useContext(AuthContext)
    const navigate = useNavigate();
    if (!user) {
        navigate("/login");
    }
    return user?<>{children}</>:<></>

}

export default PrivateRoute;