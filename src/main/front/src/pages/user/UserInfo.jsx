import React, { useEffect, useState } from 'react';
import { getUser,  deleteUser } from '../../api/firebase'; // getUserInfo 함수 import
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Button from '@mui/material/Button';

export default function UserInfo() {
  const navigate = useNavigate(); // useNavigate hook 사용
  const auth = getAuth();
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [updateTrigger] = useState(false); // 업데이트 트리거 상태

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
          const info = await getUser(currentUserEmail);
          setUserInfo(info);
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };

      // fetchUserInfo 함수 호출
      fetchUserInfo();
    }
  }, [currentUserEmail, updateTrigger]); // updateTrigger 상태가 변경될 때마다 useEffect가 실행되도록 수정

  const handleUpdate = (newUserInfo) => {
    navigate('/UserUpdate', { state: { userInfo: newUserInfo } });
  };

  const handleDelete = () => {
    // 취소 버튼 클릭 시 이전 페이지로 이동
    deleteUser(userInfo.email);
  };



  return (
    <div>
      <Typography variant="h5" gutterBottom>
        User Information
      </Typography>
      <Stack spacing={2}>
        {userInfo ? ( // userInfo가 유효한 경우에만 렌더링
          <div>
            <Typography variant="body1">
              <strong>Email:</strong> {userInfo.email || 'N/A'} {/* 이메일 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            <Typography variant="body1">
              <strong>Name:</strong> {userInfo.name || 'N/A'} {/* displayName 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            <Typography variant="body1">
              <strong>주소:</strong> {userInfo.addr || 'N/A'} {/* addr 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            <Typography variant="body1">
              <strong>상세 주소:</strong> {userInfo.detailAddr || 'N/A'} {/* detailAddr 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            <Typography variant="body1">
              <strong>전화번호:</strong> {userInfo.tel || 'N/A'} {/* tel 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>

            <Typography variant="body1">
              <strong>배송 시 요청사항:</strong> {userInfo.req || 'N/A'} {/* req 필드가 없는 경우 'N/A'를 표시 */}
            </Typography>
            
            <Typography variant="body1">
              <strong>Email Verified:</strong> {userInfo.emailVerified ? 'Yes' : 'No'}
            </Typography>

            <hr/>
              <Button onClick={() => handleUpdate(userInfo)}>업데이트 페이지로 이동</Button>

              <hr/>

            <Button variant="contained" onClick={handleDelete}>
                계정 삭제
            </Button>

          </div>
        ) : (
          <Typography variant="body1">Loading user information...</Typography>
        )}
      </Stack>
    </div>
  );
}
