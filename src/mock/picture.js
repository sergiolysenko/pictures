import {getRandomNumber} from "./utils.js";

const picturesSrcs = [
  "./img/picture-1.jpg",
  "./img/picture-2.jpg",
  "./img/picture-3.jpg"]

const picturesTitles = [
  "Lamps in Doha",
  "City skyline",
  "My first try at photo, best picture ever",
]

const authors = [
  "Mike Shinoda",
  "Lesli Jackson",
  "Ivan Demarin",
]

export const createPictureMock = () => {
  return {
    id: Math.floor(Math.random() * 1000000),
    src: picturesSrcs[getRandomNumber(0, picturesSrcs.length - 1)],
    title: picturesTitles[getRandomNumber(0, picturesTitles.length - 1)],
    author: authors[getRandomNumber(0, authors.length - 1)],
    likes: getRandomNumber(0, 8000),
  }
}

export const readyPictures = [{
  id: 100,
  src: "./img/picture-1.jpg",
  title: "My favorite picture",
  author: "James",
  likes: 0,
}, {
  id: 101,
  src: "./img/picture-2.jpg",
  title: "My liked picture",
  author: "Joseph",
  likes: 1,
}]
