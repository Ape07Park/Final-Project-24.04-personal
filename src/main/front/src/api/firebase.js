import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider,
  signInWithPopup, signOut, updateProfile, signInWithEmailAndPassword,
  onAuthStateChanged, signInWithRedirect } from "firebase/auth";
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
  signInWithPopup(auth, provider)
    .catch(console.error);
}

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider)
  // signInWithPopup(auth, provider)
    .catch(console.error);
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

