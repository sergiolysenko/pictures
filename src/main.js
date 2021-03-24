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
import {generateComment} from "./mock/comment.js";
import {PicturesModel} from "./model/pictures.js";
import {UpdateType} from "./const.js";
import {UserModel} from "./model/user.js";

const userMenuButton = document.querySelector('.user-menu__button');
const menu = document.querySelector('.user-menu__list');

const toggleUserList = () => {
  menu.hidden = !menu.hidden;
}
userMenuButton.addEventListener('click', () => {
  toggleUserList();
})

// RENDER PICTURES BOARD //
let pictures = new Array(15).fill("").map((item) => item = createPictureMock());
pictures = readyPictures.concat(pictures);

const comments = new Array(10).fill("").map((item) => item = generateComment());

const userModel = new UserModel();
const picturesModel = new PicturesModel();
picturesModel.setPictures(UpdateType.INIT, pictures);
userModel.init(userData);

const picturesListContainer = document.querySelector('.pictures-list');
const boardPresenter = new BoardPresenter(picturesListContainer, picturesModel, comments, userModel);

boardPresenter.init();
