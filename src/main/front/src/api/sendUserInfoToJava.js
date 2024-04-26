
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

//  로컬 스토리지에도 저장
// const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
// const updatedCart = [...existingCart, ...cartItems];
// localStorage.setItem('cart', JSON.stringify(updatedCart));

// })

// 먼저, 로컬 스토리지에서 cart라는 키로 저장된 값을 불러옵니다. 
// localStorage.getItem('cart')는 로컬 스토리지에서 cart 키에 해당하는 값을 문자열로 가져옵니다. 
// 만약 cart 키에 해당하는 값이 없으면 null을 반환합니다.
// 이 값은 JSON 형식의 문자열로 저장되어 있으므로, JSON.parse()를 사용하여 JavaScript 객체로 변환합니다. 
// 하지만 getItem()의 결과가 null일 수 있으므로, || []를 사용하여 기본값으로 빈 배열을 사용합니다. 
// 이렇게 하면 existingCart에는 로컬 스토리지에서 가져온 장바구니 항목들이 배열로 저장됩니다.
// 그 다음, 새로운 장바구니 항목들을 기존 장바구니에 추가합니다. ...existingCart는 기존 장바구니의 모든 항목을 가져오고, 
// ...cartItems는 새로운 장바구니 항목들을 가져옵니다. 
// 이렇게 하여 updatedCart 배열에는 기존 장바구니와 새로운 장바구니 항목들이 합쳐져 있습니다.
// 마지막으로, updatedCart 배열을 다시 JSON 형식의 문자열로 변환하여 로컬 스토리지에 cart 키로 저장합니다. 
// localStorage.setItem('cart', JSON.stringify(updatedCart))는 cart 키에 updatedCart 배열을 문자열로 저장합니다.
// 이 코드는 로컬 스토리지를 사용하여 장바구니 항목들을 저장하고 업데이트하는 역할을 합니다. 
// 주석 처리된 부분을 통해, 이 코드는 특정 상황에서 로컬 스토리지에 저장된 장바구니를 가져와서 새로운 장바구니 항목들을 추가한 후 
// 다시 저장하는 역할을 수행하고 있음을 알 수 있습니다.