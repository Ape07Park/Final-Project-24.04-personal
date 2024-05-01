import React, { useEffect, useState } from 'react';
import { deleteUserData, authRemoveUser, selectUserData } from '../../api/firebase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Button from '@mui/material/Button';

export default function UserInfo() {
  const navigate = useNavigate(); // useNavigate hook 사용
  const auth = getAuth(); // Firebase의 인증 객체
  const [currentUserEmail, setCurrentUserEmail] = useState(null); // 현재 사용자의 이메일 상태
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태

  // 인증 상태가 변경될 때마다 실행되는 콜백 함수 등록
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email); // 사용자 이메일 설정
      } else {
        setCurrentUserEmail(null); // 사용자가 로그아웃된 경우 이메일 초기화
      }
    });
  }, [auth]); // auth 객체가 변경될 때마다 useEffect가 실행되도록 수정

  // userInfo.email이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // userInfo.email이 유효한 경우에만 getUser 함수 호출
    if (currentUserEmail) {
      const fetchUserInfo = async () => {
        try {
          // getUser 함수를 호출할 때, 사용자의 이메일 값을 전달
          const info = await selectUserData(currentUserEmail);
          setUserInfo(info);

          // 관리자 여부 확인
          setIsAdmin(info && info.isAdmin === 1);
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };

      // fetchUserInfo 함수 호출
      fetchUserInfo();
    }
  }, [currentUserEmail]); // currentUserEmail 상태가 변경될 때마다 useEffect가 실행되도록 수정

  // 사용자 정보 업데이트 페이지로 이동하는 함수
  const handleUpdate = (newUserInfo) => {
    navigate('/UserUpdate', { state: { userInfo: newUserInfo } });
  };

  // 사용자 계정 삭제 함수
  const handleDelete = async () => {
    // 사용자 이메일을 userInfo에서 추출
    const userEmail = userInfo?.email;

    try {
      // db에서 사용자 정보 삭제
      await deleteUserData(userEmail);

      // auth에서 사용자 계정 삭제
      await authRemoveUser(userEmail);

      // 알림창 띄우기
      alert('계정이 삭제되었습니다.');

      // 메인 페이지로 이동
      navigate('/home');
    } catch (error) {
      console.error('계정 삭제 중 오류:', error);
    }
  };

  return (
    <div>
      {/* 사용자 정보 제목 */}
      <Typography variant="h5" gutterBottom>
        User Information
      </Typography>
      <Stack spacing={2}>
        {userInfo ? ( // userInfo가 유효한 경우에만 렌더링
          <div>
            {/* 이메일 */}
            <Typography variant="body1">
              <strong>Email:</strong> {userInfo.email || 'N/A'} {/* 이메일 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            {/* 이름 */}
            <Typography variant="body1">
              <strong>Name:</strong> {userInfo.name || 'N/A'} {/* displayName 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            {/* 주소 */}
            <Typography variant="body1">
              <strong>주소:</strong> {userInfo.addr || 'N/A'} {/* addr 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            {/* 상세 주소 */}
            <Typography variant="body1">
              <strong>상세 주소:</strong> {userInfo.detailAddr || 'N/A'} {/* detailAddr 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            {/* 전화번호 */}
            <Typography variant="body1">
              <strong>전화번호:</strong> {userInfo.tel || 'N/A'} {/* tel 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            {/* 배송 시 요청사항 */}
            <Typography variant="body1">
              <strong>배송 시 요청사항:</strong> {userInfo.req || 'N/A'} {/* req 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            {/* 이메일 인증 여부 */}
            <Typography variant="body1">
              <strong>Email Verified:</strong> {userInfo.emailVerified ? 'Yes' : 'No'}
            </Typography>

            {/* 관리자 여부 */}
            {isAdmin && (
              <Typography variant="body1" style={{ color: 'red' }}>
                <strong>관리자:</strong> Yes
              </Typography>
            )}

            <hr />
            {/* 업데이트 페이지로 이동 버튼 */}
            <Button onClick={() => handleUpdate(userInfo)}>업데이트 페이지로 이동</Button>
            <hr />

            {/* 계정 삭제 버튼 */}
            <Button variant="contained" onClick={handleDelete}>
              계정 삭제
            </Button>

          </div>
        ) : (
          <Typography variant="body1">Loading user information...</Typography> // 로딩 중
        )}
      </Stack>
    </div>
  );
}
