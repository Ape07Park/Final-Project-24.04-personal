import React, { useState } from 'react';
import UserUpdate from './UserUpdate'; // UserUpdate 컴포넌트 import

export default function ParentComponent() {
  const [userInfo, setUserInfo] = useState(/* 초기 사용자 정보 */);

  const handleUpdate = (updatedUserInfo) => {
    setUserInfo(updatedUserInfo);
  };

  return (
    <div>
      <UserUpdate userInfo={userInfo} onUpdate={handleUpdate} /> {/* onUpdate prop에 함수 전달 */}
    </div>
  );
}