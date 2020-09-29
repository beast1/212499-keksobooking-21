'use strict';

window.randomInteger = function (min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

window.hideNode = (node) => {
  node.style.display = `none`;
};

window.drawTextBlock = (className, text, parent = document) => {
  const node = parent.querySelector(className);
  if (node && text) {
    node.textContent = text;
  } else if (node) {
    window.hideNode(node);
  }
};
