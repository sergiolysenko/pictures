import "tailwindcss/tailwind.css";
import "./img/logo-pictures.png";
import "./style.css";
import firebase from "firebase/app";
import {BoardPresenter} from "./presenter/board.js";
import {PicturesModel} from "./model/pictures.js";
import {UpdateType, MenuItem} from "./const.js";
import {UserModel} from "./model/user.js";
import {SiteHeaderPresenter} from "./presenter/site-header.js";
import firebaseApi from "./api.js";
import userAuthApi from "./userAuthApi.js";

const headerContainer = document.querySelector('.header');
const picturesListContainer = document.querySelector('.pictures-list');

const handleNewTaskClose = () => {
  document.querySelector('.load-picture').disabled = false;
};

const handleSiteHeaderClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.LOAD_PICTURE:
      boardPresenter.createPicture(handleNewTaskClose);
      break;
    case MenuItem.SING_OUT:
      userAuthApi.signOut();
      break;
    case MenuItem.SING_IN:
      userAuthApi.showSignIn();
      break;
  }
};

const userModel = new UserModel();
const picturesModel = new PicturesModel();
const siteHeaderPresenter = new SiteHeaderPresenter(headerContainer, handleSiteHeaderClick);
const boardPresenter = new BoardPresenter(picturesListContainer, picturesModel, userModel);


const initApp = () => {
  siteHeaderPresenter.init(userModel);

  firebaseApi.getPictures(userModel.getUser())
  .then((pictures) => picturesModel.setPictures(UpdateType.MAJOR, pictures));
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (globalThis.isNewUser) {
      userAuthApi.createUserData(globalThis.authResult);
    }

    userAuthApi.getUserData(user)
    .then((userData) => {
      userModel.setUser(userData);
      initApp();
    });

  }
  else {
    userModel.setUser(null);
    initApp();
  }
})











