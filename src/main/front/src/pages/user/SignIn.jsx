import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../../api/firebase';
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [userInfo, setUserInfo] = useState({email:'', password:''});
  const navigate = useNavigate();

  const handleChange = e => {
    setUserInfo({...userInfo, [e.target.name]: e.target.value});
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (userInfo.email.trim() === '' || userInfo.password.trim() === '') {
        alert('이메일 혹은 패스워드를 모두 입력해주세요.');
      } 
      else{
      // 로그인 시도
      const userData = await login(userInfo);
      console.log("일반 로그인 성공:", userData);
      navigate("/Home");
      }
      // * 나중에 수정 필요
    } catch (error) {
      // 로그인 실패 시 오류 메시지 표시
      console.error('로그인 오류:', error);
    }
  }
  
  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      console.log("구글 로그인 성공");
      navigate("/Home");
    } catch (error) {
      // 로그인 실패 시 오류 메시지 표시
      alert('구글 로그인에 실패했습니다.');
      console.error('구글 로그인 오류:', error);
    }
  }

  const handleKakao = async () => {
    try {
      await loginWithKakao();
      console.log("카카오 로그인 성공");
      navigate("/Home");
    } catch (error) {
      // 로그인 실패 시 오류 메시지 표시
      alert('카카오 로그인에 실패했습니다.');
      console.error('카카오 로그인 오류:', error);
    }
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