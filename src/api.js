import firebase from "firebase/app";
import {firebaseConfig} from "./firebase-config.js";
import "firebase/firestore";
import "firebase/storage";
import {uuidv4} from "./utils/common.js";

const PICTURE_COLLECTION = 'pictures';
const COMMENTS_COLLECTION = 'comments';

const user = {
  id: 352789,
  avatar: "https://images.unsplash.com/photo-1507965613665-5fbb4cbb8399?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDQzfHRvd0paRnNrcEdnfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  name: "Alex",
  picFavorites: [],
  picLiked: [],
  commLiked: [],
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
          return this.adaptPictureDataToClient(picture, this._user);
        })
      )
  }

  getComments(picture) {
    return this._picturesCollection.doc(picture.id)
      .collection('comments').get()
      .then((response) => response.docs.map((comment) => {
        return this.adaptCommentDataToClient(comment)
      }));
  }

  deletePicture(picture) {
    return this._storage.refFromURL(picture.src)
    .delete().then(() => {
      this._picturesCollection.doc(picture.id).delete();
    });
  }

  updatePicture(update) {
    return this._picturesCollection.doc(update.id)
      .set(this.adaptPictureDataToServer(update));
  }

  loadPicture(data) {
    return this._uploadImgOnStorage(data.src)
      .then((response) => response.ref.getDownloadURL())
      .then((url) => {
        data = Object.assign({}, data, {src: url});

      return this._picturesCollection
        .add(this.adaptPictureDataToServer(data))
        .then((docRef) => docRef.get())
        .then((loadedData) => {
          return this.adaptPictureDataToClient(loadedData, this._user);
        })
      });
  }

  addComment(comment, picture) {
    return this._picturesCollection.doc(picture.id)
    .collection('comments').add(this.adaptCommentDataToServer(comment))
    .then((docRef) => docRef.get())
    .then((loadedData) => {
      return this.adaptCommentDataToClient(loadedData);
    })
  }

  updateComment(update) {
    return this._picturesCollection.doc(picture.id)
      .collection('comments').doc(update.id)
      .set(update);
  }

  deleteComment(comment, picture) {
    return this._picturesCollection.doc(picture.id)
      .collection('comments').doc(comment.id).delete();
  }

  _uploadImgOnStorage(pictureSrc) {
    const name = uuidv4();
    const ref = this._imgStorage.child(name);
    return ref.putString(pictureSrc, 'data_url');
  }

  adaptPictureDataToClient(picture) {
      return Object.assign(
        {},
        picture.data(),
        {
          id: picture.id,
          isLiked: user ? user.picLiked.some((item) => item === picture.id) : false,
          isFavorite: user ? user.picFavorites.some((item) => item === picture.id) : false,
        }
      )
  }

  adaptPictureDataToServer(data) {
    const adaptedData = Object.assign({}, data, user ? {
      author: user.name,
    } : {});

    delete adaptedData.isLiked;
    delete adaptedData.isFavorite;
    delete adaptedData.id;

    return adaptedData;
  }

  adaptCommentDataToClient(comment) {
    return Object.assign({}, comment.data(), {
      id: comment.id,
      isLiked: user ? user.commLiked.some((item) => item === comment.id) : false,
    })
  }

  adaptCommentDataToServer(comment) {
    const adaptedData = Object.assign({}, comment, user ? {
      author: user.name,
      avatar: user.avatar,
      time: new Date(),
    } : {});

    delete adaptedData.isLiked;
    delete adaptedData.id;

    return adaptedData;
  }
}

export default new Firebase();
