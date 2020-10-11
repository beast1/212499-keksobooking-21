'use strict';

(() => {
  const initPins = () => {
    const pinsTemplate = document.querySelector(`#pin`);
    const pinsFragment = document.createDocumentFragment();
    const pinsParent = document.querySelector(`.map__pins`);
    const onPinsParentClick = (e) => {
      if (e.target.offsetParent.dataset.idForCard) {
        window.card.draw(window.data.houses[e.target.offsetParent.dataset.idForCard]);
      }
    };
    const onPinsParentKeydown = (e) => {
      if (e.key === `Enter` && e.target.dataset.idForCard) {
        window.card.draw(window.data.houses[e.target.dataset.idForCard]);
      }
    };
    const drawPins = (pinsStructuredData) => {
      pinsStructuredData.forEach((pinData, i) => {
        const pinMarkup = pinsTemplate.content.querySelector(`.map__pin`).cloneNode(true);
        pinMarkup.style = `left: ${pinData.location.x - window.data.pinOffset.X}px; top: ${pinData.location.y - window.data.pinOffset.Y}px`;
        pinMarkup.attributes.src = pinData.author.avatar;
        pinMarkup.attributes.alt = pinData.offer.title;
        pinMarkup.dataset.idForCard = i;
        pinsFragment.appendChild(pinMarkup);
      });
      pinsParent.appendChild(pinsFragment);
      pinsParent.addEventListener(`click`, onPinsParentClick);
      pinsParent.addEventListener(`keydown`, onPinsParentKeydown);
    };
    const clearPins = () => {
      pinsParent.innerHTML = ``;
      pinsParent.removeEventListener(`click`, onPinsParentClick);
      pinsParent.removeEventListener(`keydown`, onPinsParentKeydown);
    };
    return {
      draw: drawPins,
      clear: clearPins
    };
  };

  window.pin = initPins();
})();
