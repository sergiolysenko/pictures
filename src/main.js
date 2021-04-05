import "tailwindcss/tailwind.css";
import "./img/logo-pictures.png";
import "./img/default-user-avatar.png";
import "./fonts/brushwell.woff2";
import "./style.css";
import "./js/firebase-initialize.js";
import firebase from "firebase/app";
import UserApi from "./js/api/user.js";
import AuthApi from "./js/api/auth.js";
import ContentDataApi from "./js/api/content-data.js";
import authPresenter from "./js/presenter/auth.js";
import {BoardPresenter} from "./js/presenter/board.js";
import {PicturesModel} from "./js/model/pictures.js";
import {SiteHeaderPresenter} from "./js/presenter/site-header.js";
import {UpdateType, MenuItem} from "./js/const.js";
import {UserModel} from "./js/model/user.js";

const headerContainer = document.querySelector('.header');
const picturesListContainer = document.querySelector('.pictures-list');

const handleNewTaskClose = () => {
  const loadPictureBtn = document.querySelector('.load-picture');
  if (loadPictureBtn) {
    loadPictureBtn.disabled = false;
  }
};

const handleSiteHeaderClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.LOAD_PICTURE:
      boardPresenter.createPicture(handleNewTaskClose);
      break;
    case MenuItem.SING_OUT:
      AuthApi.signOut();
      break;
    case MenuItem.SING_IN:
      authPresenter.showSignIn();
      break;
  }
};

const userModel = new UserModel();
const picturesModel = new PicturesModel();
const siteHeaderPresenter = new SiteHeaderPresenter(headerContainer, handleSiteHeaderClick);
const boardPresenter = new BoardPresenter(picturesListContainer, picturesModel, userModel);

const initApp = () => {
  siteHeaderPresenter.init(userModel);
  authPresenter.showLoading(picturesListContainer);

  ContentDataApi.getPictures(userModel.getUser())
  .then((pictures) => {
    picturesModel.setPictures(UpdateType.MAJOR, pictures)
    authPresenter.destroyLoading();
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    authPresenter.destroyAuthComponent();
    UserApi.getUserData(user)
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











