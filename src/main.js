import "tailwindcss/tailwind.css";
import "./img/logo-pictures.png";
import "./style.css";
import {BoardPresenter} from "./presenter/board.js";
import {render, RenderPosition} from "./utils/render.js";
import {userData} from "./mock/user.js";
import {PicturesModel} from "./model/pictures.js";
import {UpdateType, MenuItem} from "./const.js";
import {UserModel} from "./model/user.js";
import {SiteHeaderView} from "./view/site-header";
import firebaseApi from "./api.js";

const userModel = new UserModel();
const picturesModel = new PicturesModel();

userModel.init(firebaseApi.getUser());
const siteHeaderView = new SiteHeaderView(userModel.getUser());

const handleNewTaskClose = () => {
  siteHeaderView.getElement().querySelector('.load-picture').disabled = false;
};

const handleSiteHeaderClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.LOAD_PICTURE:
      boardPresenter.createPicture(handleNewTaskClose);
      break;
  }
};

const headerContainer = document.querySelector('.header');
const picturesListContainer = document.querySelector('.pictures-list');

siteHeaderView.setLoadPictureClickHandler(handleSiteHeaderClick);

const boardPresenter = new BoardPresenter(picturesListContainer, picturesModel, userModel);

render(headerContainer, siteHeaderView, RenderPosition.BEFOREEND);


firebaseApi.getPictures()
  .then((pictures) => picturesModel.setPictures(UpdateType.INIT, pictures));


