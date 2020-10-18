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
  const showUserMessage = (blockName, message) => {
    const template = document.querySelector(`#${blockName}`);
    const markup = template.content.querySelector(`.${blockName}`).cloneNode(true);
    const action = markup.querySelector(`.${blockName}__button`);
    drawTextBlock(`.${blockName}__message`, message, markup);
    document.querySelector(`body`).appendChild(markup);
    if (action) {
      action.addEventListener(`click`, () => location.reload());
    }
    if (markup) {
      markup.addEventListener(`click`, () => hideNode(markup));
      document.addEventListener(`keydown`, (e) => {
        if (e.key === `Escape`) {
          hideNode(markup);
        }
      });
    }
  };
  window.util = {
    randomInteger,
    hideNode,
    showNode,
    drawTextBlock,
    mapOffsetCheck,
    showUserMessage
  };
})();
