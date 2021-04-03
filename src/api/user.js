import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const USERS_COLLECTION = 'users';
const DEFAULT_USER_DATA = {
  avatar: "./img/default-user-avatar.png",
  favoritePic: [],
  likedComm: [],
  likedPic: [],
  loadedPic: [],
  createdComm: [],
}

class UserApi {
  constructor() {
    this._firestore = firebase.firestore();
    this._usersCollection = this._firestore.collection(USERS_COLLECTION);

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
         createdComm: userData.createdComm,
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

export default new UserApi();
