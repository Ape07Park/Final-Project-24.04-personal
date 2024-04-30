import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { updateUserData } from '../../api/firebase'; // updateUserData 함수 import
import { useLocation, useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import { useDaumPostcodePopup } from 'react-daum-postcode';

export default function UserUpdate() {
  // 사용자 정보 관련 상태 설정
  const [email, setEmail] = useState('');
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

  // 컴포넌트가 로드될 때, 이전 페이지에서 받은 userInfo로 각 상태 초기화
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
    if (!email || !name || !addr || !detailAddr || !tel) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 업데이트할 사용자 정보 객체 생성
    const updatedUserInfo = {
      email: email,
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

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Update User Information - * 는 필수 입력
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Email *"
          value={email}
          InputProps={{
            readOnly: true, // readOnly 속성을 true로 설정하여 수정 불가능하게 함
          }}
        />
        <TextField
          label="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)} // 이름 입력 시 상태 업데이트
        />
        {/* 우편번호 찾기 버튼 */}
        <button type='button' onClick={() => openPostcode({ onComplete: handleComplete })}>
          우편번호 찾기
        </button><br />
        <TextField
          label="Address *"
          value={addr}
          onChange={(e) => setAddr(e.target.value)} // 주소 입력 시 상태 업데이트
        />
        <TextField
          label="Detail Address *"
          value={detailAddr}
          onChange={(e) => setDetailAddr(e.target.value)} // 상세 주소 입력 시 상태 업데이트
        />
        <TextField
          label="Phone Number *"
          value={tel}
          onChange={(e) => setTel(e.target.value)} // 전화번호 입력 시 상태 업데이트
        />
        <TextField
          label="Delivery Request *"
          value={req}
          onChange={(e) => setReq(e.target.value)} // 배송 요청 입력 시 상태 업데이트
        />
        {/* 사용자 정보 업데이트 버튼 */}
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
        {/* 취소 버튼 */}
        <Button variant="contained" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </div>
  );
}
