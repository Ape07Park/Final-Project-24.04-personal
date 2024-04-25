import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../../api/firebase';
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
    console.log("일반 로그인 성공");
    navigate("/Home");
  }
  
  const handleGoogle = e => {
    loginWithGoogle();
    console.log("구글 로그인 성공");
    navigate("/Home");
  }

  const handleKakao = e => {
    loginWithKakao();
    console.log("카카오 로그인 성공");
    navigate("/Home");
  }


  return (
    <div style={{margin: '20px', textAlign:"center"}}>
      <form onSubmit={handleSubmit}>
        <input type="email" name='email' value={userInfo.email} placeholder="이메일"
          onChange={handleChange} /><br />
        <input type="password" name='password' value={userInfo.password} placeholder="패스워드"
          onChange={handleChange} /><br />
        <button onClick={handleSubmit}>로그인</button>
      </form><br />
      <span>아직 계정이 없으신가요?</span>
      <Link to='/signUp'>사용자 등록</Link><br /><br />
      
      <button onClick={handleGoogle}>구글 로그인</button><br />
      <button onClick={handleKakao}>카카오 로그인</button><br />

    </div>
  )
}