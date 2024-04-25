import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, signOut, updateProfile, signInWithEmailAndPassword,
  onAuthStateChanged, signInWithRedirect, OAuthProvider  } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { v4 as uuid } from 'uuid';
import {sendUserInfoToJava} from './sendUserInfoToJava'
import axios from 'axios';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

export function register({ email, password, name, addr, detailAddr, tel, req, def, isDeleted}) { //  사용처에서 obj로 처리하기에 그것에 맞춰서 제공 
  console.log('firebase:register():', email, password);
  createUserWithEmailAndPassword(auth, email, password, ) 
    // user 등록하기
    .then(() => {
      updateProfile(auth.currentUser, {
        displayName: name,
        addr: addr,
        detailAddr: detailAddr,
        tel: tel,
        req:req,
        def: def,
        isDeleted: isDeleted
      })
    })
    
    .then(() => {
      const userInfo = {
        email: email,
        displayName: name,
        addr: addr,
        detailAddr: detailAddr,
        tel: tel,
        req: req,
        def: def,
        isDeleted: isDeleted
      }; 

      // 사용자 정보를 JSON 객체로 만들어서 Java로 전송
      sendUserInfoToJava(userInfo);
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

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {

      console.log(result.user); // 사용자 정보 찍어보기
      return result.user; // 사용자 정보 반환
    })
    .catch(error => {
      console.error("Google 로그인 오류:", error);
      throw error; // 오류 재 throw
    });
}

// 카카오 로그인
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

export function getUserInfo(){
  const user = auth.currentUser;
  if (user !== null) {
    // 사용자 정보 반환
    console.log(user);
    return {
      email: user.email,
      displayName: user.displayName,
      addr: user.addr,
      detailAddr: user.detailAddr,
      tel: user.tel,
      req: user.req,
      def: user.def,
      isDeleted: user.isDeleted,
      emailVerified: user.emailVerified,
      uid: user.uid
    };
  }
  // 사용자가 로그인되어 있지 않은 경우, null 반환
  return null;
}

// 사용자의 인증 상태가 변경될 때 호출되는 콜백 함수를 등록하고, 해제할 수 있는 unsubscribe 함수 반환
export function onUserStateChanged(callback) {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });

  return unsubscribe; // unsubscribe 함수 반환
}


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
  return admins.includes(user.uid); // 관리자 목록에 사용자의 UID가 포함되어 있는지 확인하여 true 또는 false 반환
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
