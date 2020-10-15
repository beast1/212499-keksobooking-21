'use strict';

(() => {
  const randomInteger = function (min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };
  const hideNode = (node) => {
    node.style.display = `none`;
  };
  const showNode = (node) => {
    node.style.display = `block`;
  };
  const drawTextBlock = (className, text, parent = document) => {
    const node = parent.querySelector(className);
    if (node && text) {
      node.textContent = text;
    } else if (node) {
      window.hideNode(node);
    }
  };
  const mapOffsetCheck = (number, axis) => {
    if (number < window.data.mapOverlay[axis].START) {
      number = window.data.mapOverlay[axis].START;
    } else if (number > window.data.mapOverlay[axis].END) {
      number = window.data.mapOverlay[axis].END;
    }
    return number;
  };
  const showUserError = (errMessage) => {
    const errorTemplate = document.querySelector(`#error`);
    const errorMarkup = errorTemplate.content.querySelector(`.error`).cloneNode(true);
    const errorAction = errorMarkup.querySelector(`.error__button`);
    drawTextBlock(`.error__message`, errMessage, errorMarkup);
    document.querySelector(`body`).appendChild(errorMarkup);
    errorAction.addEventListener(`click`, () => location.reload());
  };
  window.util = {
    randomInteger,
    hideNode,
    showNode,
    drawTextBlock,
    mapOffsetCheck,
    showUserError
  };
})();
