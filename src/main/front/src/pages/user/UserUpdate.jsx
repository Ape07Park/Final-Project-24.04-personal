import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import { updateUserData } from '../../api/firebase'; // updateUserData 함수 import
import { useLocation, useNavigate, Link } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import { useDaumPostcodePopup } from 'react-daum-postcode';

import CssBaseline from '@mui/material/CssBaseline';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 디자인
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function UserUpdate() {
  // 사용자 정보 관련 상태 설정
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [addr, setAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [tel, setTel] = useState('');
  const [req, setReq] = useState('');

  // 현재 페이지의 URL 정보를 가져오기 위해 useLocation 훅 사용
  const location = useLocation();
  // 페이지 이동을 위한 함수 가져오기
  const navigate = useNavigate();
  // 이전 페이지에서 전달된 userInfo 가져오기
  const { userInfo } = location.state || {};

  // 컴포넌트가 로드될 때, 이전 페이지에서 받은 userInfo로 각 상태 초기화,
  // 비밀번호는 무조건 변경하도록 함
  // 왜냐하면 유저 정보 업데이트는 유저가 진짜 그 유저가 맞는지 확인 후에 하기 때문에
  useEffect(() => {
    if (userInfo) {
      const { email, name, addr, detailAddr, tel, req } = userInfo;
      setEmail(email || '');
      setName(name || '');
      setAddr(addr || '');
      setDetailAddr(detailAddr || '');
      setTel(tel || '');
      setReq(req || '');
    }
  }, [userInfo]);

  // Daum 우편번호 팝업 관련 함수
  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  // Daum 우편번호 팝업에서 주소 선택 시 호출되는 함수
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

    // 주소 설정
    setAddr(fullAddress);
  }

  // 사용자 정보 업데이트 함수
  const handleUpdate = async () => {
    // 필수 정보가 모두 입력되었는지 확인
    if (!email || !password || !confirmPassword || !name || !addr || !detailAddr || !tel) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 비밀번호와 비밀번호 확인 값이 일치하는지 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 업데이트할 사용자 정보 객체 생성
    const updatedUserInfo = {
      email: email,
      password: password,
      name: name,
      addr: addr,
      detailAddr: detailAddr,
      tel: tel,
      req: req,
    };

    try {
      // 사용자 정보 업데이트 요청
      await updateUserData(updatedUserInfo);
      console.log('사용자 정보가 업데이트되었습니다.');
      // 업데이트 후, 이전 페이지로 이동
      navigate(-1);
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류:', error);
    }
  };

  // 취소 버튼 클릭 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  const handleTelChange = (e) => {
    const { value } = e.target;

    // 숫자 이외의 문자 제거
    const telValue = value.replace(/[^0-9]/g, '');

    // 하이픈(-) 추가
    let formattedTel = '';
    if (telValue.length <= 3) {
      formattedTel = telValue;
    } else if (telValue.length <= 7) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3);
    } else if (telValue.length <= 11) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7);
    } else {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7, 11);
    }

    // 최대 길이 제한을 넘지 않도록 자르기
    const maxLength = 13; // 최대 길이는 13자리 (010-1234-5678)
    const updatedTel = formattedTel.slice(0, maxLength);

    // 상태 업데이트
    setTel(updatedTel);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Update User Information - * 는 필수 입력
            </Typography>

            <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3 }}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email *"
                    value={email}
                    InputProps={{
                      readOnly: true, // readOnly 속성을 true로 설정하여 수정 불가능하게 함
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password *"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 시 상태 업데이트
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password *"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} // 비밀번호 확인 입력 시 상태 업데이트
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 이름 입력 시 상태 업데이트
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="button"
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={() => openPostcode({ onComplete: handleComplete })}
                  >
                    Find Postal Code
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address *"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)} // 주소 입력 시 상태 업데이트
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Detail Address *"
                    value={detailAddr}
                    onChange={(e) => setDetailAddr(e.target.value)} // 상세 주소 입력 시 상태 업데이트
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number *"
                    value={tel}
                    onChange={handleTelChange} // 전화번호 입력 시 상태 업데이트
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Request *"
                    value={req}
                    onChange={(e) => setReq(e.target.value)} // 배송 요청 입력 시 상태 업데이트
                  />
                </Grid>

              </Grid>

              {/* 사용자 정보 업데이트 버튼 */}
<Button
  fullWidth
  variant="contained"
  sx={{ mt: 3, mb: 1 }} // 간격 조정
  onClick={handleUpdate}
>
  Update
</Button>

{/* 취소 버튼 */}
<Button
  fullWidth
  variant="contained"
  sx={{ mt: 3, mb: 2 }} // 간격 조정
  onClick={handleCancel}
>
  Cancel
</Button>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
