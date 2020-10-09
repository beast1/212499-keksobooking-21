'use strict';

const houseDataPatterns = {
  types: [`palace`, `flat`, `house`, `bungalow`],
  checkin: [`12:00`, `13:00`, `14:00`],
  features: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  photos: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]
};

const pinOffset = {
  X: 25,
  Y: 70
};

const mapOverlayY = {
  START: 130,
  END: 630
};

const pinTextContent = {
  TITLE: `Уютный очаг на краю города`,
  DESCRIPTION: `Теплое место, последнее пристанище расплавленного ума`
};

const types = {
  flat: `Квартира`,
  bungalow: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
};

const generateLocation = () => {
  const mapOverlay = document.querySelector(`.map__overlay`);
  return {
    x: window.randomInteger(pinOffset.X, mapOverlay.offsetWidth),
    y: window.randomInteger(mapOverlayY.START + pinOffset.Y, mapOverlayY.END)
  };
};

const generateFeatures = (houseRandomData) => {
  return houseRandomData.features.filter(() => window.randomInteger(0, 1));
};

const generatePhotos = (houseRandomData) => {
  return houseRandomData.photos.filter(() => window.randomInteger(0, 1));
};

const generateHousesData = (houseRandomData, pinsCount) => {
  const pins = [];

  for (let i = 0; i < pinsCount; i++) {
    const location = generateLocation();

    pins.push({
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: pinTextContent.TITLE,
        address: `${location.x}, ${location.y}`,
        price: window.randomInteger(999, 9999),
        type: houseRandomData.types[window.randomInteger(0, 3)],
        rooms: window.randomInteger(1, 5),
        guests: window.randomInteger(1, 8),
        checkin: houseRandomData.checkin[window.randomInteger(0, 2)],
        checkout: houseRandomData.checkin[window.randomInteger(0, 2)],
        features: generateFeatures(houseRandomData),
        description: pinTextContent.DESCRIPTION,
        photos: generatePhotos(houseRandomData)
      },
      location: {
        x: location.x,
        y: location.y
      }
    });
  }

  return pins;
};
//
//
//   Сделайте так, чтобы одновременно могла быть открыта только одна карточка объявления.
//
//   Обратите внимание, что у главной метки .map__pin--main не может быть карточки объявления.
const initPins = () => {
  const pinsTemplate = document.querySelector(`#pin`);
  const pinsFragment = document.createDocumentFragment();
  const pinsParent = document.querySelector(`.map__pins`);
  //для меток похожих объявлений должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
  const onPinsParentClick = (e) => {
    if (e.target.offsetParent.dataset.idForCard) {
      console.log(e.target.offsetParent);
      // Доработайте проект так, чтобы пользователь мог открыть карточку любого доступного объявления;
      window.card.draw(window.housesData[e.target.offsetParent.dataset.idForCard]);
    }
  };
  // Добавьте поддержку открытия карточки объявления с клавиатуры. Карточка объявления для выбранной метки открывается при нажатии на клавишу Enter.
  const onPinsParentKeydown = (e) => {
    //todo добавить обработку клавиатуры
    console.log(e);
    // if (e.target.offsetParent.dataset.idForCard) {
    //   console.log(e.target.offsetParent);
    //   window.card.draw(window.housesData[e.target.offsetParent.dataset.idForCard]);
    // }
  };
  const drawPins = (pinsStructuredData) => {
    pinsStructuredData.forEach((pinData, i) => {
      const pinMarkup = pinsTemplate.content.querySelector(`.map__pin`).cloneNode(true);
      pinMarkup.style = `left: ${pinData.location.x - pinOffset.X}px; top: ${pinData.location.y - pinOffset.Y}px`;
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

const initCard = () => {
  const cardTemplate = document.querySelector(`#card`);
  const cardMarkup = cardTemplate.content.querySelector(`.map__card`).cloneNode(true);
  const cardCloseBtn = cardMarkup.querySelector(`.popup__close`);
  const filtersContainer = document.querySelector(`.map__filters-container`);
  const featuresParent = cardMarkup.querySelector(`.popup__features`);
  const featureMarkup = featuresParent.querySelector(`.popup__feature`).cloneNode(true);
  const photosParent = cardMarkup.querySelector(`.popup__photos`);
  const photoMarkup = photosParent.querySelector(`.popup__photo`).cloneNode(true);
  const drawCardFeatures = (data) => {
    if (data && featuresParent) {
      const featuresFragment = document.createDocumentFragment();
      data.forEach((feature) => {
        featureMarkup.className = `popup__feature popup__feature--${feature}`;
        featuresFragment.appendChild(featureMarkup);
      });
      featuresParent.innerHTML = ``;
      featuresParent.appendChild(featuresFragment);
    } else if (featuresParent) {
      window.hideNode(featuresParent);
    }
  };
  const drawCardPhotos = (data) => {
    if (data && photosParent) {
      const photosFragment = document.createDocumentFragment();
      data.forEach((photo) => {
        photoMarkup.src = photo;
        photosFragment.appendChild(photoMarkup);
      });
      photosParent.innerHTML = ``;
      photosParent.appendChild(photosFragment);
    } else if (photosParent) {
      window.hideNode(photosParent);
    }
  };
  const drawCardAvatar = (data) => {
    const avatar = cardMarkup.querySelector(`.popup__avatar`);
    if (data && avatar) {
      avatar.src = data;
    } else if (avatar) {
      window.hideNode(avatar);
    }
  };
  const onCardCloseBtnClick = () => {
    window.card.clear();
  };
  const drawCard = (housesData) => {
    window.drawTextBlock(`.popup__title`, housesData.offer.title, cardMarkup);
    window.drawTextBlock(`.popup__text--address`, housesData.offer.address, cardMarkup);
    window.drawTextBlock(`.popup__text--price`, `${housesData.offer.price}₽/ночь`, cardMarkup);
    window.drawTextBlock(`.popup__type`, types[housesData.offer.type], cardMarkup);
    window.drawTextBlock(`.popup__text--capacity`, `${housesData.offer.rooms} комнаты для ${housesData.offer.guests} гостей`, cardMarkup);
    window.drawTextBlock(`.popup__text--time`, `Заезд после ${housesData.offer.checkin}, выезд до ${housesData.offer.checkout}`, cardMarkup);
    drawCardFeatures(housesData.offer.features);
    window.drawTextBlock(`.popup__description`, housesData.offer.description, cardMarkup);
    drawCardPhotos(housesData.offer.photos);
    drawCardAvatar(housesData.author.avatar);

    filtersContainer.before(cardMarkup);
    // todo заменить на метод из utils
    cardMarkup.classList.remove(`hidden`);
    cardCloseBtn.addEventListener(`click`, onCardCloseBtnClick);
  };
  const clearCard = () => {
    cardMarkup.classList.add(`hidden`);
    console.log(filtersContainer);
    cardCloseBtn.removeEventListener(`click`, onCardCloseBtnClick);
  };
  return {
    draw: drawCard,
    clear: clearCard
  };
};

window.card = initCard();
window.pins = initPins();
window.housesData = generateHousesData(houseDataPatterns, 8);

