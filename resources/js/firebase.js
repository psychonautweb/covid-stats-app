// Firbase Code needed only for checking if user is logged in or not!

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDflXmgDmQDb_y3sIYkPEOpJAvnGXWWLTg',
  authDomain: 'covid19-tracker-project-713ab.firebaseapp.com',
  databaseURL:
    'https://covid19-tracker-project-713ab-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'covid19-tracker-project-713ab',
  storageBucket: 'covid19-tracker-project-713ab.appspot.com',
  messagingSenderId: '1034154994583',
  appId: '1:1034154994583:web:fb81e2c9eecd26bf7fb2d2',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // user can be 1(logged) or 0(logged out)
      console.log(user);
      console.log('you ARE logged in already');
      //function to show the page/app
      // hide the sign up form
    } else {
      console.log('you are not logged in');
      //something.innerHTML = 'logged out / you are not logged in'
    }
  });
};

monitorAuthState();

export default firebase;
