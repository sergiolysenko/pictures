import "tailwindcss/tailwind.css";
import "./img/logo-pictures.png";
import "./img/picture-1.jpg";
import "./img/picture-2.jpg";
import "./img/picture-3.jpg";
import "./style.css";
import {BoardPresenter} from "./presenter/board.js";
import {render, RenderPosition} from "./utils/render.js";
import {createPictureMock} from "./mock/picture.js";
import {generateComment} from "./mock/comment.js";

const userMenuButton = document.querySelector('.user-menu__button');
const menu = document.querySelector('.user-menu__list');

const toggleUserList = () => {
  menu.hidden = !menu.hidden;
}
userMenuButton.addEventListener('click', () => {
  toggleUserList();
})

// RENDER PICTURES BOARD //
const pictures = new Array(15).fill("").map((item) => item = createPictureMock());
const comments = new Array(10).fill("").map((item) => item = generateComment());

const picturesListContainer = document.querySelector('.pictures-list');
const boardPresenter = new BoardPresenter(picturesListContainer, pictures, comments);

boardPresenter.init();

