import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, set, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsRStVOFj_3bVFmN99vQnBcfsxeuaf4Rs",
  authDomain: "login-with-firebase-data-78d83.firebaseapp.com",
  projectId: "login-with-firebase-data-78d83",
  storageBucket: "login-with-firebase-data-78d83.appspot.com",
  messagingSenderId: "841963351385",
  appId: "1:841963351385:web:5c5e5af8ecc07bf0b83048",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app)

const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")
const userName = document.getElementById("user-name")
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");
const loginEmail = document.getElementById("email-login");
const loginPassword = document.getElementById("password-login");

const authForm = document.querySelector(".wrapper");
const loginContent = document.querySelector(".container");

const registerButton = document.getElementById("register-btn");
const loginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const navLogin = document.getElementById("nav-login")
const showName = document.getElementById("show-name")

const register = async () => {
  const signUpName = userName.value;
  const signUpEmail = userEmail.value;
  const signUpPassword = userPassword.value;
  // console.log(signUpName)
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      set(ref(database, 'users/' + user.uid), {
        userName: signUpName,
        email: signUpEmail
      })
      // console.log(user);
      registerForm.reset();
      alert("Your account has been created!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });
};

const login = async () => {
  const signInEmail = loginEmail.value;
  const signInPassword = loginPassword.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      
      const dt = new Date()
      
      // onValue(uName,(snapshot) => {
      //   const showName = snapshot.val();
      //   userName.textContent = showName
      // })
      update(ref(database, 'users/' + user.uid), {
        last_login: dt
      })
      loginForm.reset();
      alert("You have login successfully!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });
};

const userSignOut = async () => {
  await signOut(auth);  
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authForm.classList.remove('active-popup');
      authForm.classList.add('toggle')
      loginContent.classList.remove('toggle');
      logoutButton.classList.remove('toggle');
      navLogin.classList.add('toggle');

      const uName = ref(database, 'users/' + user.uid + '/userName')
      // console.log(uName)
      onValue(uName,(snapshot) => {
        const nameData = snapshot.val();
        // console.log(showName)
        showName.innerText = nameData
      })
    } else {      
      loginContent.classList.add('toggle');
      authForm.classList.remove('toggle')
      logoutButton.classList.add('toggle');
      navLogin.classList.remove('toggle');
    }
  });
};

checkAuthState();

//Validate functions
// function validate_email(email) {
//   expression = /^[^@]+@\w+(\.\w+)+\w$/
//   if (expression.test(email) == true) {
//     // Email is good
//     return true
//   } else {
//     // Email is not good
//     return false
//   }
// }

// function validate_password(password) {
//   // Firebase only accepts lengths greater than 6
//   if (password.length < 6) {
//     return false
//   } else {
//     return true
//   }
// }

// function validate_field(field) {
//   if (field == null) {
//     return false
//   }
// }

registerButton.addEventListener("click", register);
loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", userSignOut);
