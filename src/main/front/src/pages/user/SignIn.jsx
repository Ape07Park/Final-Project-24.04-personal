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
    // 이메일과 패스워드가 둘 다 입력되었는지 확인
    if (userInfo.email.trim() === '' || userInfo.password.trim() === '') {
      alert('이메일 혹은 패스워드를 모두 입력해주세요.');
    } // db와 비교해서 이메일, 비번 틀린 경우 alert('이메일 혹은 패스워드가 틀렸습니다');
    
    else{
      login(userInfo);
      console.log("일반 로그인 성공");
      navigate("/Home");
    }
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
      <form>
        <input type="email" name='email' value={userInfo.email} placeholder="이메일"
         required  onChange={handleChange} /><br />
        <input type="password" name='password' value={userInfo.password} placeholder="패스워드"
         required  onChange={handleChange} /><br />
        <button onClick={handleSubmit}>로그인</button>
      </form><br />

      <span>아직 계정이 없으신가요?</span>
      <Link to='/signUp'>사용자 등록</Link><br /><br />
      {/* 후에 로고로 대체하기  */}
      <button onClick={handleGoogle}>구글 로그인</button><br /><br />
      <button onClick={handleKakao}>카카오 로그인</button>

    </div>
  )
}