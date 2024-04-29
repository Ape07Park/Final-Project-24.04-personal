import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { updateUserData } from '../../api/firebase'; // updateUserData 함수 import
import { useLocation } from 'react-router';

export default function UserUpdate() {
  // userInfo가 존재하는지 확인 후 값 할당
  const [name, setName] = useState('');
  const [addr, setAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [tel, setTel] = useState('');
  const [req, setReq] = useState('');
  const location = useLocation();
  const { userInfo } = location.state || {};
  // 컴포넌트가 마운트될 때 기존 사용자 정보를 상태에 할당
  
  useEffect(() => {
    if (userInfo) {
      const { name, addr, detailAddr, tel, req } = userInfo;
      setName(name || '');
      setAddr(addr || '');
      setDetailAddr(detailAddr || '');
      setTel(tel || '');
      setReq(req || '');
    }
  }, [userInfo]);

  const handleUpdate = async () => {
    // 새로운 사용자 정보 객체 생성
    const updatedUserInfo = {
      name: name,
      addr: addr,
      detailAddr: detailAddr,
      tel: tel,
      req: req,
    };
    // 사용자 정보 업데이트 요청
    try {
      await updateUserData(updatedUserInfo); // 새로운 사용자 정보로 업데이트
      console.log('사용자 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Update User Information
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Address"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
        />
        <TextField
          label="Detail Address"
          value={detailAddr}
          onChange={(e) => setDetailAddr(e.target.value)}
        />
        <TextField
          label="Phone Number"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />
        <TextField
          label="Delivery Request"
          value={req}
          onChange={(e) => setReq(e.target.value)}
        />
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="contained">
          Cancel
        </Button>
      </Stack>
      
      {userInfo && ( // userInfo가 존재하는 경우에만 렌더링
        <div>
          <Typography variant="h6" gutterBottom>
            Current User Information
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Name:</strong> {userInfo.name || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {userInfo.addr || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Detail Address:</strong> {userInfo.detailAddr || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {userInfo.tel || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Delivery Request:</strong> {userInfo.req || 'N/A'}
            </Typography>
          </Stack>
        </div>
      )}
    </div>
  );
}
