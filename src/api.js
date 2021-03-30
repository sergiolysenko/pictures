import firebase from "firebase/app";
import {firebaseConfig} from "./firebase-config.js";
import "firebase/firestore";
import "firebase/storage";
import {uuidv4} from "./utils/common.js";

const PICTURE_COLLECTION = 'pictures';
const user = {
  id: 352789,
  avatar: "https://images.unsplash.com/photo-1507965613665-5fbb4cbb8399?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDQzfHRvd0paRnNrcEdnfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  name: "Alex",
  favorites: [],
  liked: []
}

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);

    this._user = user;
    this._storage = firebase.storage();
    this._firestore = firebase.firestore();
    this._picturesCollection = this._firestore.collection(PICTURE_COLLECTION);
    this._imgStorage = this._storage.ref('img');
  }

  getUser() {
    return this._user;
  }

  getPictures() {
    return this._picturesCollection.get()
      .then((response) => response.docs.map((picture) => {
          return this.adaptDataToClient(picture, this._user);
        })
      )
  }

  deletePicture(picture) {
    return this._storage.refFromURL(picture.src)
    .delete().then(() => {
      this._picturesCollection.doc(picture.id).delete();
    });
  }

  updatePictureData(update) {
    return this._picturesCollection.doc(update.id)
      .set(this.adaptDataToServer(update));
  }

  loadPictureData(data) {
    return this.uploadImgOnStorage(data.src)
      .then((response) => response.ref.getDownloadURL())
      .then((url) => {
        data = Object.assign({}, data, {src: url});

      return this._picturesCollection
        .add(this.adaptDataToServer(data))
        .then((docRef) => docRef.get())
        .then((loadedData) => {
          return this.adaptDataToClient(loadedData, this._user);
        })
      });
  }

  uploadImgOnStorage(pictureSrc) {
    const name = uuidv4();
    const ref = this._imgStorage.child(name);
    return ref.putString(pictureSrc, 'data_url');
  }

  adaptDataToClient(picture, user) {
      return Object.assign(
        {},
        picture.data(),
        {
          id: picture.id,
          isLiked: user ? user.liked.some((item) => item === picture.id) : false,
          isFavorite: user ? user.favorites.some((item) => item === picture.id) : false,
        }
      )
  }

  adaptDataToServer(data) {
    const adaptedData = Object.assign({}, data, user ? {
      author: user.name,
    } : {});

    delete adaptedData.isLiked;
    delete adaptedData.isFavorite;
    delete adaptedData.id;

    return adaptedData;
  }
}

export default new Firebase();

// Создать социал презентер в котором объеденить блок лайков и комментарии
// Его можно будет легко удалять и грузить заново...
// Как минимум перенести всю фигню с кнопкой и рендером в комментс презентер.
