import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider,
  signInWithPopup, signOut, updateProfile, signInWithEmailAndPassword,
  onAuthStateChanged, signInWithRedirect, OAuthProvider  } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { v4 as uuid } from 'uuid';

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
    .then(() => {logout()})
    .catch(console.error);
}

export function login({ email, password }) {
  console.log('firebase.js:login(): ', email, password);
  signInWithEmailAndPassword(auth, email, password)  // email, password 받기
    .catch(console.error);
}

export function loginWithGithub() {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      return result.user; // 사용자 정보 반환
    })
    .catch(error => {
      console.error("Github 로그인 오류:", error);
      throw error; // 오류 재 throw
    });
}

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      return result.user; // 사용자 정보 반환
    })
    .catch(error => {
      console.error("Google 로그인 오류:", error);
      throw error; // 오류 재 throw
    });
}

export function loginWithKakao(){
  const provider = new OAuthProvider('oidc.kakao');

  // 카카오 로그인
signInWithPopup(auth, provider)
  .then((result) => {
    // User is signed in.
    // IdP data available using getAdditionalUserInfo(result)

    // Get the OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    const idToken = credential.idToken;
  })
  .catch((error) => {
    // Handle error.
  });
}


export function logout() {
  signOut(auth).catch(console.error);
}

export function onUserStateChanged(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

async function adminUser(user) {
  return get(ref(database, 'admins')) // db에서 관리자 목록 가져오기, 나중에 axios get으로 바뀌고 user 파라미터가 서버 주소로 바뀜
    .then(snapshot => {
      if (snapshot.exists()) {
        const admins = snapshot.val(); // 원하는 객체 뽑아내기 
        console.log(admins);
        const isAdmin = admins.includes(user.uid);  // user uid 포함하는지 확인
        return {...user, isAdmin};
      }
      return user;
    });
}

