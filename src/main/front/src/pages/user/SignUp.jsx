import React, { useState } from "react";
import { register, loginWithGoogle, loginWithKakao } from '../../api/firebase';
import { Link, useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from 'react-daum-postcode';

export default function SignUp() {
  const [userInfo, setUserInfo] = useState({
    email:'', password:'', confirmPassword:'', name:'', addr:'', 
    detailAddr:'', tel:'', req:'', def:'', isAdmin: 0 // isAdmin 초기값 추가
  });

  const navigate = useNavigate();

  // 사용자 정보 변경 핸들러
  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name === "req" && value.trim() === '') {
      setUserInfo({...userInfo, [name]: '조심히 와주세요'});
    } 
    else if (name === "tel") {
      // 전화번호 입력 시 '-' 추가
      const telValue = value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
      const formattedTel = telValue.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
      setUserInfo({...userInfo, [name]: formattedTel});
    } else {
      setUserInfo({...userInfo, [name]: value});
    }
  }

  // 이메일 중복 확인 핸들러
  const handleEmailBlur = () => {
    // 여기서는 간단히 이메일이 비어있지 않으면 중복된 것으로 가정합니다.
    if (userInfo.email !== '') {
      setUserInfo({...userInfo, emailExists: true});
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = e => {
    e.preventDefault(); // 기본 제출 동작 방지
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    register(userInfo); // 사용자 등록 함수 호출
    console.log("회원가입 정보:", userInfo); // 회원가입 정보 출력
    navigate('/signIn');
  }

// 구글 로그인 핸들러
const handleGoogle = async () => {
  try {
    const userInfo = await loginWithGoogle();
    console.log("구글로 로그인한 사용자 정보:", userInfo);
    navigate('/UserInfo');
    setTimeout(() => {
      alert("업데이트 페이지에서 사용자 정보를 업데이트 해주세요");
    }, 700); // setTimeout을 사용하여 다음 이벤트 큐에 넣어 순서를 조정합니다.
  } catch (error) {
    console.error("구글 로그인 오류:", error);
    alert("구글 로그인에 오류가 발생했습니다.");
    navigate('/home'); // 또는 다른 경로로 리다이렉트
  }
}

// 카카오 로그인 핸들러
const handleKakao = async () => {
  try {
    const userInfo = await loginWithKakao();
    console.log("카카오로 로그인한 사용자 정보:", userInfo);
    navigate('/UserInfo'); // 'UserInfo' 페이지로 이동
    setTimeout(() => {
      alert("업데이트 페이지에서 사용자 정보를 업데이트 해주세요");
    }, 700); // setTimeout을 사용하여 다음 이벤트 큐에 넣어 순서를 조정합니다.
  } catch (error) {
    console.error("카카오 로그인 오류:", error);
    alert("카카오 로그인에 오류가 발생했습니다.");
    navigate('/home'); // 또는 다른 경로로 리다이렉트
  }
}



  // Daum 우편번호 팝업 열기 함수
  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  // Daum 우편번호 팝업에서 주소 선택 시 호출되는 완료 핸들러
  const handleComplete = data => {
    let fullAddress = data.address; // 선택된 주소
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setUserInfo({
      ...userInfo,
      addr: fullAddress // 선택된 주소를 사용자 정보에 업데이트
    });
  };

  return (
    <div style={{margin: '20px', textAlign:'center'}}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 이메일 입력란 */}
        <input type="email" name='email' value={userInfo.email} placeholder="이메일"
          onChange={handleChange} onBlur={handleEmailBlur} required /><br/><br/>
        
        {/* 비밀번호 입력란 */}
        <input type="password" name='password' value={userInfo.password} placeholder="비밀번호"
          onChange={handleChange} required /><br /><br/>

        {/* 비밀번호 확인 입력란 */}
        <input type="password" name='confirmPassword' value={userInfo.confirmPassword} placeholder="비밀번호 확인"
          onChange={handleChange} required /><br /><br/>

        {/* 이름 입력란 */}
        <input type="text" name='name' value={userInfo.name} placeholder="이름" required
          onChange={handleChange} /><br /><br/>

        {/* 우편번호 입력란 */}
        <button type='button' onClick={() => openPostcode({ onComplete: handleComplete })}>
          우편번호 찾기
        </button><br /><br/>
        
        <input type="text" id="sample6_postcode" placeholder="우편번호" value={userInfo.addr} readOnly /><br/><br/>

        {/* 상세주소 입력란 */}
        <input type="text" id="sample6_detailAddress" name='detailAddr' value={userInfo.detailAddr} placeholder="받는 분 상세주소" required
          onChange={handleChange} /><br /><br/>

        {/* 전화번호 입력란 */}
        <input type="text" name="tel" value={userInfo.tel} placeholder="전화번호" required maxLength="13"
          onChange={handleChange} /><br /><br/>

        {/* 배송 요청사항 입력란 */}
        <input type="text" name='req' value={userInfo.req="조심히 와주세요"} placeholder="배송시 요청사항" 
          onChange={handleChange} hidden/><br />

        {/* 기본 배송 여부 선택 */}
        <input type="radio" name='def' value="Y" checked={userInfo.def === "Y"} 
          onChange={handleChange} /> 예

        <input type="radio" name='def' value="N" checked={userInfo.def === "N"}
          onChange={handleChange} /> 아니요
        <br/><br/>

        {/* 사용자 등록 버튼 */}
        <button type="submit">사용자 등록</button>
      </form><br />

      {/* 이미 계정이 있으신가요? */}
      <span>계정이 있으신가요?</span>
      <Link to='/signIn'>로그인</Link><br /><br />
      
      {/* 구글 로그인 버튼 */}
      <button onClick={handleGoogle}>구글 로그인</button>
      <br /><br />

      {/* 카카오 로그인 버튼 */}
      <button onClick={handleKakao}>카카오 로그인</button>
      <br /><br />
      
    </div>
  )
};
