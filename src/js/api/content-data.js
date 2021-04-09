import firebase from "firebase/app";
import {uuidv4} from "../utils/common.js";
import "firebase/firestore";
import "firebase/storage";
import "firebaseui/dist/firebaseui.css";
import { UserDataKey } from "../const.js";

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
      ).catch((error) => {
        console.log(error `has occured`);
        return []
      })
  }

  getPictureById(id, user) {
    return this._picturesCollection.doc(id).get()
    .then((response) => this.adaptPictureDataToClient(response, user));
  }

  async getUserPictures(user) {
    const getUserPicturesByKey = (key, user) => {
      return Promise.all(user[key].map((pictureId) => {
        return this.getPictureById(pictureId, user)
      }));
    }

    return {
      loadedPic: await getUserPicturesByKey(UserDataKey.LOADED_PIC, user),
      likedPic: await getUserPicturesByKey(UserDataKey.LIKED_PIC, user),
      favoritePic: await getUserPicturesByKey(UserDataKey.FAVORITE_PIC, user)
    }
  }

  deletePicture(picture) {
    return this._storage.refFromURL(picture.src)
    .delete().then(() => {
      this._picturesCollection.doc(picture.id).delete();
    }).catch((error) => {
      throw new Error(`Error while deleting, please try later. ${error}`);
    });
  }

  updatePicture(update) {
    return this._picturesCollection.doc(update.id)
      .set(this.adaptPictureDataToServer(update))
      .catch((error) => {
        throw new Error(`Fail while updating picture! Please try later. ${error}`)
      });
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
        }).catch((error) => {
          throw new Error(`Error while picture data! - ${error}`)
        });
      });
  }

  getComments(picture, user) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).get()
      .then((response) => response.docs.map((comment) => {
        return this.adaptCommentDataToClient(comment, user)
      })).catch((error) => {
        throw new Error(`Error while getting comments, ${error}`)
      });;
  }

  addComment(comment, picture, user) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).add(this.adaptCommentDataToServer(comment, user))
      .then((docRef) => docRef.get())
      .then((loadedData) => {
        return this.adaptCommentDataToClient(loadedData);
      }).catch((error) => {
        throw new Error(`Add comment error, ${error}`)
      });
  }

  updateComment(update, picture) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).doc(update.id)
      .set(this.adaptCommentDataToServer(update))
      .catch((error) => {
        throw new Error(`Update comment error, ${error}`)
      });;
  }

  deleteComment(comment, picture) {
    return this._picturesCollection.doc(picture.id)
      .collection(COMMENTS_COLLECTION).doc(comment.id).delete()
      .catch((error) => {
        throw new Error(`Error while deleting comment, ${error}`)
      });;
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
        }
      )
  }

  adaptPictureDataToServer(data, user) {
    const adaptedData = Object.assign({}, data, user ? {
      author: user.name,
      authorId: user.id,
    } : {});
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
      authorId: user.id,
      avatar: user.avatar,
      time: new Date(),
    } : {});

    delete adaptedData.isLiked;
    delete adaptedData.id;

    return adaptedData;
  }
}

export default new ContentDataApi();
