import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, signOut, updateProfile, signInWithEmailAndPassword,
  onAuthStateChanged, signInWithRedirect, OAuthProvider   } from "firebase/auth";
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import {getDatabase, ref, set, get, remove, child, update } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

/*========================= login =========================*/
export function login({ email, password }) {
  console.log('firebase.js:login(): ', email, password);
  signInWithEmailAndPassword(auth, email, password)  // email, password 받기
  .catch((error) => {
    // 로그인 실패
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('로그인 실패:', errorMessage);
  });
}

// # 구글 로그인
export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
  .then((result) => {

      console.log(result.user); // 사용자 정보 찍어보기
      insertUserWithSocial(result.user.email, result.user.displayName) // 사용자 정보 db에 저장
      return result.user; // 사용자 정보 반환
    })
    
    .catch(error => {
      console.error("Google 로그인 오류:", error);
      throw error; // 오류 재 throw
    });
}

// # 카카오 로그인
export function loginWithKakao(){
  const provider = new OAuthProvider('oidc.kakao');
  
signInWithPopup(auth, provider)
  .then((result) => {  
    // User is signed in.
    // IdP data available using getAdditionalUserInfo(result)

    // Get the OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    const idToken = credential.idToken;
    
    console.log(result.user); // 사용자 정보 찍어보기
    insertUserWithSocial(result.user.email, result.user.displayName) // 사용자 정보 db에 저장
    return result.user;
  })
  .catch((error) => {
    console.error("kakao 로그인 오류:", error);
      throw error; // 오류 재 throw
  });
}

export function logout() {
  signOut(auth).catch(console.error);
}

// --------------------- #login 끝 ----------------------

/*========================= # Authentication =========================*/
export function register({ email, password, name, addr, detailAddr, 
  tel, req, def, isAdmin}) { //  사용처에서 obj로 처리하기에 그것에 맞춰서 제공 
  console.log('firebase:register():', email, password);
  createUserWithEmailAndPassword(auth, email, password) 

    // user 등록하기
    .then(() => {
      console.log("User created in Firebase Authentication");
      updateProfile(auth.currentUser, {
        email: email,
        name: name,
        addr: addr,
        detailAddr: detailAddr,
        tel: tel,
        req: req,
        def: def,
        isAdmin: isAdmin
      })
      console.log("User profile  updated");
    })
    .then(() => {
      insertUser(email, name, addr, detailAddr, tel, 
        req, def, isAdmin );
        console.log("User added to Database");
    })
    .then(() => {logout()})

    .catch((error) => {
      // Firebase Authentication에 사용자 생성 중 오류 발생한 경우
      const errorCode = error.code;
      console.error("Error creating user:", error);

      // 오류 코드에 따라 다른 메시지 출력
      let errorMessage = "사용자 등록 중 오류가 발생했습니다. 나중에 다시 시도해주세요.";
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "이미 사용 중인 이메일 주소입니다. 다른 이메일 주소를 사용하세요.";
      }

      alert(errorMessage); // 오류 메시지 출력
      throw error; // 오류 다시 던지기
    });
}

// Authentication에서 user 제거
export function ToAuthDeleteUser() {
  const user = auth.currentUser; // 현재 로그인된 사용자 가져오기
  
  console.log(user);

  // Firebase Authentication에서 사용자 삭제
  deleteUser(user).then(() => {
    // 사용자가 삭제된 경우
    console.log("User deleted from Authentication");

    // DB에서 사용자 삭제
    deleteUser(user.email).then(() => {
      // 사용자가 DB에서 삭제된 경우
      console.log("User deleted from Database");
    }).catch((error) => {
      // DB에서 사용자 삭제 중 오류 발생한 경우
      console.error("Error deleting user from Database:", error);
    });
  }).catch((error) => {
    // Firebase Authentication에서 사용자 삭제 중 오류 발생한 경우
    console.error("Error deleting user from Authentication:", error);
  });
}

/*========================= # Authentication 끝=========================*/

/*========================= DAO =========================*/
function insertUser(email, name, addr, detailAddr, tel, req, def, isAdmin) {
  if (!email) {
    console.error("이메일이 유효하지 않습니다.");
    return;
  }
  const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
  // Firebase Realtime Database에 사용자 정보를 저장하는 코드
  set(ref(database, 'users/' + sanitizedEmail), {
    email: email,
    name: name,
    addr: addr,
    detailAddr: detailAddr,
    tel: tel,
    req: req,
    def: def,
    isAdmin: isAdmin
  }).then(() => {
    console.log("사용자 정보가 성공적으로 저장되었습니다.");
  }).catch((error) => {
    console.error("사용자 정보 저장 중 오류가 발생했습니다:", error);
  });
}

// 소셜 로그인을 이용하여 로그인 한 경우 DB에 데이터 저장
function insertUserWithSocial(email, displayName) {
  const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
  // Firebase Realtime Database에 사용자 정보를 저장하는 코드
  set(ref(database, 'users/' + sanitizedEmail), {
    email: email,
    name: displayName,
    addr: '',
    detailAddr: '',
    tel: '',
    req: '',
    def: 0,
    isAdmin: 0
  }).then(() => {
    console.log("사용자 정보가 성공적으로 저장되었습니다.");
  }).catch((error) => {
    console.error("사용자 정보 저장 중 오류가 발생했습니다:", error);
  });
}


// email이 undefined

export async function getUser(email) {

  if (!email) {
    console.error("이메일이 유효하지 않습니다.");
    return null;
  }
  
  const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일

  return get(ref(database, `users/${sanitizedEmail}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
      } 
      return null;
    })
    .catch(error => {
      console.error("사용자 정보를 가져오는 중 오류가 발생했습니다:", error);
      return null;
    });
}

export async function updateUserData(user) {
  const { email, name, addr, detailAddr, tel, req } = user;
  try {
    // email이 정의되어 있을 때만 업데이트를 시도합니다.
    if (email) {
      const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
      await update(ref(database, `users/${sanitizedEmail}`), {
        name,
        addr,
        detailAddr,
        tel,
        req
      });
      console.log('사용자 정보가 업데이트되었습니다.');
    } else {
      throw new Error('이메일이 없습니다.'); // email이 없으면 오류를 발생시킵니다.
    }
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류:', error);
    throw error; // 오류를 다시 던져서 호출하는 쪽에서 처리할 수 있도록 합니다.
  }
}

export async function deleteUser(email) {
  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
    await remove(ref(database, `users/${sanitizedEmail}`));
    return { success: true, message: '사용자 정보가 성공적으로 삭제되었습니다.' };
  } catch (error) {
    console.error('사용자 정보 삭제 중 오류:', error);
    return { success: false, message: '사용자 정보 삭제 중 오류가 발생했습니다.' };
  }
}


/*========================= 인증 상태 확인 =========================*/

// onAuthStateChanged 함수를 호출하여 사용자의 인증 상태가 변경될 때 호출되는 콜백 함수 등록
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 사용자가 로그인된 상태일 때 실행되는 부분
    console.log(user);
    const email = user.email; // 사용자의 이메일 가져오기
    console.log('사용자 이메일:', email);

    // 이후에 이메일을 필요한 곳에서 사용할 수 있음
  } else {
    // 사용자가 로그아웃된 상태일 때 실행되는 부분
    console.log('사용자가 로그아웃되었습니다.');
  }
});

// 사용자의 인증 상태가 변경될 때 호출되는 콜백 함수를 등록하고, 해제할 수 있는 unsubscribe 함수 반환
export function onUserStateChanged(callback) {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });

  return unsubscribe; // unsubscribe 함수 반환
}


// # 관리자 관련 함수 
// Axios를 사용하여 서버에서 관리자 목록을 가져오는 함수
async function fetchAdmins() {
  try {
    const response = await axios.get('서버에서 관리자 목록을 가져오는 엔드포인트 URL'); // 서버에서 관리자 목록을 가져오는 요청
    return response.data; // 관리자 목록 반환
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}

// 관리자인지 확인하는 함수
async function isAdmin(user) {
  const admins = await fetchAdmins(); // 서버에서 관리자 목록 가져오기
  return admins.includes(user.email); // 관리자 목록에 사용자의 email가 포함되어 있는지 확인하여 true 또는 false 반환
}

// 사용자 정보를 관리자 권한으로 업데이트하는 함수
async function adminUser(user) {
  try {
    const userWithAdminFlag = {
      ...user,
      isAdmin: await isAdmin(user) // 사용자가 관리자인지 여부 확인하여 isAdmin 속성 추가
    };
    return userWithAdminFlag; // 업데이트된 사용자 정보 반환
  } catch (error) {
    console.error('Failed to update user with admin flag:', error);
    return user; // 에러 발생 시 원본 사용자 정보 반환
  }
}

