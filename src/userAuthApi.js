import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import 'firebaseui/dist/firebaseui.css'
import firebaseApi from "./api.js";

const USERS_COLLECTION = 'users';
const DEFAULT_USER_DATA = {
  avatar: "./img/default-user-avatar.png",
  favoritePic: [],
  likedComm: [],
  likedPic: [],
  loadedPic: [],
}

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

  getCurrentUser() {
    return this.getUserData(firebase.auth().currentUser);
  }

  getUserData(firebaseUser) {
    return this._usersCollection.doc(firebaseUser.uid).get()
    .then((userDoc) => {
      const userData = userDoc.data();

      return {
         id: firebaseUser.uid,
         name: firebaseUser.displayName,
         avatar: userData.avatar,
         favoritePic: userData.favoritePic,
         likedComm: userData.likedComm,
         likedPic: userData.likedPic,
         loadedPic: userData.loadedPic,
       }
     })
     .catch((error) => {
       throw new Error(`Can't find user with ${firebaseUser.uid}, or it's ${error}`)
     });
  }

  updateUserData(data) {
    return this._usersCollection.doc(data.id)
      .set(this.adaptUserDataToServer(data))
      .then(() => console.log(`User ${data.name} data has been successfully updated`))
      .catch((error) => console.log(`Something goes wrong! ${error}`));
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

  createUserData(authResult) {
    this._usersCollection.doc(authResult.user.uid).set(DEFAULT_USER_DATA)
    .then(() => {
      console.log("New user data has been created successfully");
    }).catch((error) => {
      throw new Error(`Error while creating user data - ${error}`)
    })
  }

  adaptUserDataToServer(data) {
    const adaptedData = Object.assign({}, data);

    delete adaptedData.id;
    delete adaptedData.name;

    return adaptedData;
  }
}

export default new UserAuthApi();
