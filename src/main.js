import "tailwindcss/tailwind.css";
import "./img/logo-pictures.png";
import "./img/default-user-avatar.png";
import "./style.css";
import "./firebase-initialize.js";
import firebase from "firebase/app";
import {BoardPresenter} from "./presenter/board.js";
import {PicturesModel} from "./model/pictures.js";
import {UpdateType, MenuItem} from "./const.js";
import {UserModel} from "./model/user.js";
import {SiteHeaderPresenter} from "./presenter/site-header.js";
import ContentDataApi from "./api/content-data.js";
import UserApi from "./api/user.js";
import AuthApi from "./api/auth.js";
import authPresenter from "./presenter/auth.js";

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











