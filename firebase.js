// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzDfKHO-NniA-vU1kq_QUjtSDTx26Jnrk",
  authDomain: "mad-quiz-a4bfc.firebaseapp.com",
  projectId: "mad-quiz-a4bfc",
  storageBucket: "mad-quiz-a4bfc.appspot.com",
  messagingSenderId: "95789551120",
  appId: "1:95789551120:web:194ac906847ab2521ec495",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// export const auth = getAuth(firebaseApp);
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const storage = getStorage(firebaseApp);
// change the rules of Storage as follows:

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if true;
//     }
//   }
// }
