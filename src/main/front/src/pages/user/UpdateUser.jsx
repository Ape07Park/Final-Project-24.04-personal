import React, { useState } from 'react';
import firebase from 'firebase/app'; // Firebase 코어 모듈 import
import 'firebase/auth'; // Firebase Authentication 모듈 import

export default function UpdateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateUser = () => {
    const user = firebase.auth().currentUser;

    // 사용자가 현재 로그인되어 있지 않으면 종료
    if (!user) {
      console.log('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    // 이메일 및 비밀번호 업데이트 요청
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    user.reauthenticateWithCredential(credential)
      .then(() => {
        // 사용자 재인증 성공 후 이메일 및 비밀번호 업데이트
        if (newEmail && newEmail !== user.email) {
          user.updateEmail(newEmail)
            .then(() => {
              console.log('이메일 업데이트 성공:', user.email);
              setEmail('');
              setNewEmail('');
            })
            .catch((error) => {
              console.error('이메일 업데이트 실패:', error.message);
            });
        }
        if (newPassword) {
          user.updatePassword(newPassword)
            .then(() => {
              console.log('비밀번호 업데이트 성공');
              setPassword('');
              setNewPassword('');
            })
            .catch((error) => {
              console.error('비밀번호 업데이트 실패:', error.message);
            });
        }
      })
      .catch((error) => {
        console.error('재인증 실패:', error.message);
      });
  };

  return (
    <div>
      <h2>Update User Information</h2>
      <div>
        <label>Current Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Current Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>New Email:</label>
        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
      </div>
      <div>
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <button onClick={handleUpdateUser}>Update</button>
    </div>
  );
}

