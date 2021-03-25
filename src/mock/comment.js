import {getRandomNumber} from "./utils.js";

const avatars = ["https://images.unsplash.com/photo-1616171812687-1028c744649d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1616344906751-b94c54d3a392?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80", "https://images.unsplash.com/photo-1507965613665-5fbb4cbb8399?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDQzfHRvd0paRnNrcEdnfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"];

const authors = [
  "Mike Shinoda",
  "Lesli Jackson",
  "Ivan Demarin",
]

const comments = [
  "I think this is the best I’ve seen till now",
  "Just when I couldn’t love you more.", "You posted this pic and my jaw dropped to the floor.",
  "Surely you are the most beautiful woman alive, the most that I’ve seen",
  "The word pretty is worthless without you",
  "Flawless outstanding eccentric lovely beauty",
  "The stars, the moon, and the sun are minor to me since you sparkle brighter than all of them", "Surely you would have been arrested if looking immensely beautiful was a crime."
]

const generateComment = () => {
  return {
    id: Math.floor(Math.random() * 1000000),
    avatar: avatars[getRandomNumber(0, avatars.length - 1)],
    author: authors[getRandomNumber(0, authors.length - 1)],
    text: comments[getRandomNumber(0, authors.length - 1)],
    time: new Date(),
    likeCount: Math.floor(Math.random() * 100),
  }
}

const comments1 = new Array(5).fill("").map((item) => item = generateComment());
const comments2 = new Array(7).fill("").map((item) => item = generateComment());

export const allComments = [{
  pictureId: 101,
  comments: comments1,
}, {
  pictureId: 100,
  comments: comments2,
}]
