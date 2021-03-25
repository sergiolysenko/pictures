import "tailwindcss/tailwind.css";
import "./img/logo-pictures.png";
import "./img/picture-1.jpg";
import "./img/picture-2.jpg";
import "./img/picture-3.jpg";
import "./style.css";
import {BoardPresenter} from "./presenter/board.js";
import {render, RenderPosition} from "./utils/render.js";
import {createPictureMock, readyPictures} from "./mock/picture.js";
import {userData} from "./mock/user.js";
import {allComments} from "./mock/comment.js";
import {PicturesModel} from "./model/pictures.js";
import {UpdateType, MenuItem} from "./const.js";
import {UserModel} from "./model/user.js";
import {SiteHeaderView} from "./view/site-header";

// MOCKS ///
let pictures = new Array(15).fill("").map((item) => item = createPictureMock());
pictures = readyPictures.concat(pictures);

// RENDER PICTURES BOARD //
const userModel = new UserModel();
const picturesModel = new PicturesModel();
picturesModel.setPictures(UpdateType.INIT, pictures);
userModel.init(userData);
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
boardPresenter.init();


