import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import 'firebaseui/dist/firebaseui.css'

const USERS_COLLECTION = 'users';

class UserAuthApi {
  constructor() {
    this._firebaseui = require("firebaseui");
    this._authUi = new this._firebaseui.auth.AuthUI(firebase.auth());
    this.authResult = null;

    this._firestore = firebase.firestore();
    this._usersCollection = this._firestore.collection(USERS_COLLECTION);

    this.showSignIn = this.showSignIn.bind(this);
    this.createUserData = this.createUserData.bind(this);
  }

  getUser() {
    return firebase.auth().currentUser;
  }

  getUserData(user) {
    return this._usersCollection.doc(user.uid).get()
    .then((userDoc) => {
      const userData = userDoc.data();

      return {
         id: user.uid,
         name: user.displayName,
         avatar: userData ? userData.avatar : [],
         favoritePic: userData ? userData.favoritePic : [],
         likedComm: userData ? userData.likedComm : [],
         likedPic: userData ? userData.likedPic : [],
         loadedPic: userData ? userData.loadedPic : [],
       }
     })
     .catch((error) => {
       throw new Error(`Can't find user with ${user.uid}, or it's ${error}`)
     });
  }

  showSignIn() {
    this._authUi.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          globalThis.authResult = authResult;
          globalThis.isNewUser = authResult.additionalUserInfo.isNewUser;
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

  createUserData(authResult) {
    this._usersCollection.doc(authResult.user.uid).set({
      avatar: "./img/default-user-avatar.png",
      favoritePic: [],
      likedComm: [],
      likedPic: [],
      loadedPic: [],
    }).then(() => {
      console.log("New user data created successfully");
    }).catch((error) => {
      throw new Error(`Error with creating user data - ${error}`)
    })
  }
}

export default new UserAuthApi();
