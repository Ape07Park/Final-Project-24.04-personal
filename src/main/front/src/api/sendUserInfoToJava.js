
export function sendUserInfoToJava(userInfo) {
  // JavaScript 객체를 JSON 문자열로 변환
  const jsonUserInfo = JSON.stringify(userInfo);

  // HTTP 요청을 보내는 fetch() 함수 사용
  fetch('http://your-java-api-url.com', {
    method: 'POST', // POST 요청
    headers: {
      'Content-Type': 'application/json' // JSON 데이터를 전송함을 명시
    },
    body: jsonUserInfo // JSON 문자열을 요청의 본문으로 전송
  })

  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // 서버에서 받은 응답을 JSON 형식으로 파싱하여 반환
  })
  .then(data => {
    // 서버로부터 받은 데이터 처리
    console.log('Received data from server:', data);
  })
  .catch(error => {
    // 오류 처리
    console.error('Error sending data to server:', error);
  });
}

