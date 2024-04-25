import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../api/firebase'; // getUserInfo 함수 import
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 getUserInfo 함수를 호출하여 사용자 정보를 가져옴
    const info = getUserInfo();
    console.log(info);
    setUserInfo(info);
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        User Information
      </Typography>
      <Stack spacing={2}>
        {userInfo ? (
          <div>
            <Typography variant="body1">
              <strong>Email:</strong> {userInfo.email}
            </Typography>

            <Typography variant="body1">
              <strong>Display Name:</strong> {userInfo.displayName}
            </Typography>

            <Typography variant="body1">
              <strong>주소:</strong> {userInfo.addr}
            </Typography>

            <Typography variant="body1">
              <strong>상세 주소:</strong> {userInfo.detailAddr}
            </Typography>

            <Typography variant="body1">
              <strong>전화번호:</strong> {userInfo.tel}
            </Typography>

            <Typography variant="body1">
              <strong>배송 시 요청사항:</strong> {userInfo.req}
            </Typography>
            
            <Typography variant="body1">
              <strong>Email Verified:</strong> {userInfo.emailVerified ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body1">
              <strong>UID:</strong> {userInfo.uid}
            </Typography>
          </div>
        ) : (
          <Typography variant="body1">Loading user information...</Typography>
        )}
      </Stack>
    </div>
  );
}
