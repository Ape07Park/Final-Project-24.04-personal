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

// --------------------- #login 완료 ----------------------

/*========================= # users =========================*/

export function register({ email, password, name, addr, detailAddr, tel, req, def, isDeleted, isAdmin}) { //  사용처에서 obj로 처리하기에 그것에 맞춰서 제공 
  console.log('firebase:register():', email, password);
  createUserWithEmailAndPassword(auth, email, password, ) 
    // user 등록하기
    .then(() => {
      updateProfile(auth.currentUser, {
        email:email,
        name: name,
        addr: addr,
        detailAddr: detailAddr,
        tel: tel,
        req:req,
        def: def,
        isDeleted: isDeleted,
        isAdmin: isAdmin
      })
    })
    
    .then(() => {
      insertUser(email, name, addr, detailAddr, tel, 
        req, def, isDeleted, isAdmin );
    })

    .then(() => {logout()})
    .catch((error)=>{
      // 오류 처리
      const errorCode = error.code;

      if(errorCode === "auth/email-already-in-use"){
        alert("이미 사용중인 이메일 주소입니다. 다른 이메일 주소를 사용하세요")
      }else{
        console.log(error);
      }
  })
}

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


/*========================= DAO =========================*/
function insertUser(email, name, addr, detailAddr, tel, req, def, isDeleted, isAdmin) {
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
    isDeleted: isDeleted,
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
    isDeleted: 0,
    isAdmin: 0
  }).then(() => {
    console.log("사용자 정보가 성공적으로 저장되었습니다.");
  }).catch((error) => {
    console.error("사용자 정보 저장 중 오류가 발생했습니다:", error);
  });
}

// --------------------- insert 완료 ----------------------

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
    await update(ref(database, `users/${email}`), {
      name,
      addr,
      detailAddr,
      tel,
      req
    });
    console.log('사용자 정보가 업데이트되었습니다.');
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류:', error);
    throw error; // 오류를 다시 던져서 호출하는 쪽에서 처리할 수 있도록 합니다.
  }
}


export async function deleteUser(email) {
  return remove(ref(database, `users/${email}`));
}


/*========================= 인증 상태 확인 =========================*/

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

