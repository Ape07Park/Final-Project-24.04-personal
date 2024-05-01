import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { isAdmin } from '../api/firebase'; // Firebase 함수 가져오기
import { useAuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuthContext(); // useAuthContext 훅을 사용하여 현재 사용자와 로그아웃 함수 가져오기
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const admin = await isAdmin(user); // isAdmin 함수 호출
        setIsAdminUser(admin);
      }
    };

    checkAdmin(); // useEffect에서 호출

  }, [user]);

  const handleLogout = () => {
    logout(); // 로그아웃 함수 호출
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome to our website!</h1>
      <h2>This is the home page.</h2>

      {user ? ( // 사용자가 로그인한 경우에만 로그아웃 버튼 표시
        <>
          <h3>Hello, {user.displayName || user.name}</h3>
          {/* {isAdminUser && <h3>Hello, Admin</h3>} */}
          <Link to='/UserInfo'>유저 정보 페이지로 이동 </Link><br /><br />
          <Button variant="outlined" onClick={handleLogout}>로그아웃</Button> {/* 로그아웃 버튼 */}
        </>
      ) : (
        <>
          <Link to='/signUp'>사용자 등록</Link><br /><br />
          <Link to='/signIn'>로그인 페이지로 이동 </Link><br /><br />
        </>
      )}
    </div>
  );
}
