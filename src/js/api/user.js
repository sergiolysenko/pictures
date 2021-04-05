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
  }

  getCurrentUser() {
    return this.getUserData(firebase.auth().currentUser);
  }

  updateUserData(data) {
    return this._usersCollection.doc(data.id)
      .set(this.adaptUserDataToServer(data))
      .then(() => console.log(`User ${data.name} data has been successfully updated`))
      .catch((error) => console.log(`Something goes wrong! ${error}`));
  }

  getUserData(firebaseUser) {
    const currentUserDocRef = this._usersCollection.doc(firebaseUser.uid);

    return currentUserDocRef.get().then((response) => {
      if(response.exists) {
        console.log(`Welcome back ${firebaseUser.displayName}`);
        return this.adaptUserDataToClient(response.data(), firebaseUser);
      } else {
        return currentUserDocRef.set(DEFAULT_USER_DATA).then(() => {
          console.log("New user data has been created successfully");
          return this.adaptUserDataToClient(DEFAULT_USER_DATA, firebaseUser);;
        }).catch((error) => {
          throw new Error(`Error while creating user data - ${error}`)
        })
      }
    }).catch((error) => {
      throw new Error(`The current user data not exist - ${error}`)
    })
  }

  adaptUserDataToClient(data, firebaseUser) {
    return Object.assign({}, data, {
      id: firebaseUser.uid,
      name: firebaseUser.displayName,
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
