import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Chat from './screens/Chat/Chat';
import Register from './screens/Register/Register';
import Login from './screens/Login/Login';

function App() {
  const { authToken,isRegister,isTokenExpired,removeToken, initUsername} : any = useAuth();
  useEffect(() => {
    if(isTokenExpired()){
      removeToken();
    }
    if(authToken){
      initUsername()
    }
  }, []);
  return (
    <div>
      {
        authToken ? <Chat/> : isRegister ? <Login /> : <Register/>
      }
    </div>
  );
}

export default App;
