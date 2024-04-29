import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/user/SignUp';
import SignIn from './pages/user/SignIn';
import Home from './pages/Home'; 
import UserInfo from './pages/user/UserInfo';
import UserUpdate from './pages/user/UserUpdate';
import { AuthContextProvider } from './context/AuthContext'


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthContextProvider><Home /></AuthContextProvider>} /> {/* 기본 경로인 / 에 대한 Home 컴포넌트 */}
        <Route path="/signUp" element={<SignUp />} /> {/* "/signup" 경로에 대한 SignUp 컴포넌트 */}
        <Route path="/signIn" element={<SignIn />} /> {/* "/signin" 경로에 대한 SignIn 컴포넌트 */}
        <Route path="/UserInfo" element={<UserInfo />} />
        <Route path="/UserUpdate" element={<UserUpdate />} />
      </Routes>
    </div>
  );
}

export default App;
