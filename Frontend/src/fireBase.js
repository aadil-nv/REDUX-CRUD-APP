
import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: "AIzaSyD0qEjcU24eiwyqH-Aj6G_KVQ8blNIp0xo",
  authDomain: "redux-crud-app-react.firebaseapp.com",
  projectId: "redux-crud-app-react",
  storageBucket: "redux-crud-app-react.appspot.com",
  messagingSenderId: "972025925928",
  appId: "1:972025925928:web:502e886fd1dd57abb9c01d"
};

export const app = initializeApp(firebaseConfig);