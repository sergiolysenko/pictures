import firebase from "firebase/app";
import {uuidv4} from "../utils/common.js";
import "firebase/firestore";
import "firebase/storage";
import "firebaseui/dist/firebaseui.css";

const PICTURE_COLLECTION = 'pictures';
const COMMENTS_COLLECTION = 'comments';

class ContentDataApi {
  constructor() {
    this._storage = firebase.storage();
    this._firestore = firebase.firestore();
    this._picturesCollection = this._firestore.collection(PICTURE_COLLECTION);
    this._imgStorage = this._storage.ref('img');
  }

  getPictures(user) {
    return this._picturesCollection.get()
      .then((response) => response.docs.map((picture) => {
          return this.adaptPictureDataToClient(picture, user);
        })
      )
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

  loadPicture(data, user) {
    return this._uploadImgOnStorage(data.src)
      .then((response) => response.ref.getDownloadURL())
      .then((url) => {
        data = Object.assign({}, data, {src: url});

      return this._picturesCollection
        .add(this.adaptPictureDataToServer(data, user))
        .then((docRef) => docRef.get())
        .then((loadedData) => {
          return this.adaptPictureDataToClient(loadedData, user);
        })
      });
  }

  getComments(picture, user) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).get()
      .then((response) => response.docs.map((comment) => {
        return this.adaptCommentDataToClient(comment, user)
      }));
  }

  addComment(comment, picture, user) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).add(this.adaptCommentDataToServer(comment, user))
      .then((docRef) => docRef.get())
      .then((loadedData) => {
        return this.adaptCommentDataToClient(loadedData);
      })
  }

  updateComment(update, picture) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).doc(update.id)
      .set(this.adaptCommentDataToServer(update));
  }

  deleteComment(comment, picture) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).doc(comment.id).delete();
  }

  _uploadImgOnStorage(pictureSrc) {
    const name = uuidv4();
    const ref = this._imgStorage.child(name);
    return ref.putString(pictureSrc, 'data_url');
  }

  adaptPictureDataToClient(picture, user) {
      return Object.assign(
        {},
        picture.data(),
        {
          id: picture.id,
          isLiked: user ? user.likedPic.some((item) => item === picture.id) : false,
          isFavorite: user ? user.favoritePic.some((item) => item === picture.id) : false,
        }
      )
  }

  adaptPictureDataToServer(data, user) {
    const adaptedData = Object.assign({}, data, user ? {
      author: user.name,
    } : {});

    delete adaptedData.isLiked;
    delete adaptedData.isFavorite;
    delete adaptedData.id;

    return adaptedData;
  }

  adaptCommentDataToClient(comment, user) {
    return Object.assign({}, comment.data(), {
      id: comment.id,
      isLiked: user ? user.likedComm.some((item) => item === comment.id) : false,
    })
  }

  adaptCommentDataToServer(comment, user) {
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

export default new ContentDataApi();
