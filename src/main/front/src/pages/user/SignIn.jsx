import React, { useState } from "react";
import { loginWithGithub, login } from '../../api/firebase';
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [userInfo, setUserInfo] = useState({email:'', password:''});
  const navigate = useNavigate();
  const handleChange = e => {
    setUserInfo({...userInfo, [e.target.name]: e.target.value});
  }
  const handleSubmit = e => {
    e.preventDefault();
    login(userInfo);
    navigate(-1);
  }
  
  const handleGithub = e => {
    loginWithGithub();
    navigate(-1);
  }

  return (
    <div style={{margin: '20px'}}>
      <form onSubmit={handleSubmit}>
        <input type="email" name='email' value={userInfo.email} placeholder="이메일"
          onChange={handleChange} /><br />
        <input type="password" name='password' value={userInfo.password} placeholder="패스워드"
          onChange={handleChange} /><br />
        <button onClick={handleSubmit}>로그인</button>
      </form><br />
      <span>아직 계정이 없으신가요?</span>
      <Link to='/signUp'>사용자 등록</Link><br /><br />
      <button onClick={handleGithub}>깃허브 로그인</button>

    </div>
  )
}