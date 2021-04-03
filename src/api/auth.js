import firebase from "firebase/app";
import 'firebaseui/dist/firebaseui.css'

class AuthApi {
  constructor() {
    this._firebaseui = require("firebaseui");
    this._authUi = new this._firebaseui.auth.AuthUI(firebase.auth());
  }

  showSignIn() {
     this._authUi.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          globalThis.authResult = authResult;
          globalThis.isNewUser = authResult.additionalUserInfo.isNewUser;
          console.log('User has been logged');

          return false;
        },
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
    });
  }

  signOut() {
    firebase.auth().signOut()
    .then(() => console.log('The user signed out'));
  }
}

export default new AuthApi();
