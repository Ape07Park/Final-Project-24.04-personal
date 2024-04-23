import React, { useState } from "react";
import { register, loginWithGithub } from '../../api/firebase';

import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [userInfo, setUserInfo] = useState({email:'', password:'', name:'', addr:'', 
  detailAddr:'', tel:'', req:'', def:'', isDeleted:'' });

  const navigate = useNavigate();

  // -> 04/23  조심히 와주세요, 휴대폰 번호 입력 수정 필요
  const handleChange = e => {
    if (e.target.name === 'req' && !e.target.value) {
      setUserInfo({...userInfo, req: '조심히 와주세요'});
    } else {
      setUserInfo({...userInfo, [e.target.name]: e.target.value});
    }
  }

  const handleSubmit = e => {
  e.preventDefault();
  register(userInfo);
  console.log("회원가입 정보:", userInfo);
  // navigate('/signIn');
}
  const handleGithub = e => {
    loginWithGithub();
    navigate(-1);  // 이전 스테이트로 갈 것 즉 뒤로 가기
  }

  const phoneAutoHyphen = (e) => {
    let value = e.target.value
      .replace(/[^0-9]/g, '')  // Remove non-numeric characters
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3");  // Apply phone number format
    setUserInfo({...userInfo, tel: value});
  }
   

  return (
    <div style={{margin: '20px'}}>
      <form onSubmit={handleSubmit}>

        <input type="email" name='email' value={userInfo.email} placeholder="이메일"
          onChange={handleChange} /><br />

        <input type="password" name='password' value={userInfo.password} placeholder="패스워드"
          onChange={handleChange} /><br />

        <input type="text" name='name' value={userInfo.name} placeholder="이름" required
          onChange={handleChange} /><br />

        <input type="text" name='addr' value={userInfo.addr} placeholder="주소" required
          onChange={handleChange} /><br />

        <input type="text" name='detailAddr' value={userInfo.detailAddr} placeholder="받는 분 상세주소" required
          onChange={handleChange} /><br />

        <input type="text" name="tel" value={userInfo.tel} placeholder="전화번호" required maxLength="14"
          onChange={phoneAutoHyphen}
          // onChange={handleChange} // If you want to use handleChange as well
        /><br />
        
        <input type="text" name='req' value={userInfo.req} placeholder="배송시 요청사항" 
          onChange={handleChange} /><br />

        <input type="radio" name='def' value="Y" checked={userInfo.def === "Y"} 
        onChange={handleChange} /> yes

        <input type="radio" name='def' value="N" checked={userInfo.def === "N"}
          onChange={handleChange} /> no


        <button onClick={handleSubmit}>사용자 등록</button>
      </form><br />
      <span>계정이 있으신가요?</span>
      <Link to='/signIn'>로그인</Link><br /><br />
      <button onClick={handleGithub}>깃허브 로그인</button>
      <br /><br />
      
    </div>
  )
}