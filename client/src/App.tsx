import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Chat from './screens/Chat/Chat';
import Register from './screens/Register/Register';
import Login from './screens/Login/Login';

function App() {
  const { authToken,isRegister} : any = useAuth();
  return (
    <div>
      {
        authToken ? <Chat/> : isRegister ? <Login /> : <Register/>
      }
    </div>
  );
}

export default App;
