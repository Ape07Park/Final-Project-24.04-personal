import React, { useEffect, useState } from 'react';
import { deleteUserData, authRemoveUser, selectUserData } from '../../api/firebase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Button from '@mui/material/Button';

export default function UserInfo() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });
  }, [auth]);

  useEffect(() => {
    if (currentUserEmail) {
      const fetchUserInfo = async () => {
        try {
          const info = await selectUserData(currentUserEmail);
          setUserInfo(info);
          setIsAdmin(info && info.isAdmin === 1);
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };

      fetchUserInfo();
    }
  }, [currentUserEmail]);

  const handleUpdate = (newUserInfo) => {
    navigate('/UserUpdate', { state: { userInfo: newUserInfo } });
  };

  const handleDelete = async () => {
    const userEmail = userInfo?.email;

    try {
      await deleteUserData(userEmail);
      await authRemoveUser(userEmail);
      alert('계정이 삭제되었습니다.');
      navigate('/home');
    } catch (error) {
      console.error('계정 삭제 중 오류:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        User Information
      </Typography>
      <Stack spacing={2}>
        {userInfo ? (
          <div>
            <Typography variant="body1">
              <strong>Email:</strong> {userInfo.email || 'N/A'}
            </Typography>

            <Typography variant="body1">
              <strong>Name:</strong> {userInfo.name || 'N/A'}
            </Typography>

            <Typography variant="body1">
              <strong>주소:</strong> {userInfo.addr || 'N/A'}
            </Typography>

            <Typography variant="body1">
              <strong>상세 주소:</strong> {userInfo.detailAddr || 'N/A'}
            </Typography>

            <Typography variant="body1">
              <strong>전화번호:</strong> {userInfo.tel || 'N/A'}
            </Typography>

            <Typography variant="body1">
              <strong>배송 시 요청사항:</strong> {userInfo.req || 'N/A'}
            </Typography>

            <Typography variant="body1">
              <strong>Email Verified:</strong> {userInfo.emailVerified ? 'Yes' : 'No'}
            </Typography>

            {isAdmin && (
              <Typography variant="body1" style={{ color: 'red' }}>
                <strong>관리자:</strong> Yes
              </Typography>
            )}

            <hr />
            <Button onClick={() => handleUpdate(userInfo)}>업데이트 페이지로 이동</Button>
            <hr />

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
