import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
      import {
        getDatabase,
        set,
        ref,
        update,
      } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';
      import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
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

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const auth = getAuth();

      signUp.addEventListener('click', (e) => {
        let email = document.getElementById('email').value;
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;

            set(ref(database, 'users/' + user.uid), {
              username: username,
              email: email,
            });
            alert('usercreated');
            // change this to clear the user form and make it more appealing
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
            // ..
          });
      });

      login.addEventListener('click', (e) => {
        let email = document.getElementById('login-email').value;
        let password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const loginDate = new Date();
            update(ref(database, 'users/' + user.uid), {
              last_login: loginDate,
            });

            window.location.href = "./dashboard.html";
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
          });
      });