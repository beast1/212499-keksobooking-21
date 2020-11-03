/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!********************!*\
  !*** ./js/util.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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
    document.addEventListener(`keydown`, (event) => {
      if (event.key === `Escape`) {
        hideNode(markup);
      }
    });
  }
};
const contains = (where, what) => {
  for (let i = 0; i < what.length; i++) {
    if (where.indexOf(what[i]) === -1) {
      return false;
    }
  }
  return true;
};
const findAndRemove = (arr, targetItem) => {
  arr.splice(arr.findIndex((item) => {
    return item === targetItem;
  }), 1);
};
const changeDisabledAttr = (node, state) => {
  if (state) {
    node.setAttribute(`disabled`, `true`);
  } else {
    node.removeAttribute(`disabled`);
  }
};
window.util = {
  randomInteger,
  hideNode,
  showNode,
  drawTextBlock,
  mapOffsetCheck,
  showUserMessage,
  contains,
  findAndRemove,
  changeDisabledAttr
};

})();

(() => {
/*!************************!*\
  !*** ./js/debounce.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 300;

window.debounce = function (callback) {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      callback(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

})();

(() => {
/*!********************!*\
  !*** ./js/load.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const loadParams = {
  METHOD: `GET`,
  RESPONSE_TYPE: `json`,
  TIMEOUT: `10000`
};
const load = (url, onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.open(loadParams.METHOD, url);
  xhr.responseType = loadParams.RESPONSE_TYPE;
  xhr.timeout = loadParams.TIMEOUT;
  xhr.addEventListener(`error`, function () {
    onError(window.data.messages.load.common);
  });
  xhr.addEventListener(`timeout`, function () {
    onError(`${window.data.messages.load.timeout.pre} ${xhr.timeout} ${window.data.messages.load.timeout.post}`);
  });
  xhr.addEventListener(`load`, () => {
    let err;
    switch (xhr.status) {
      case 200:
        onSuccess(xhr.response);
        break;
      case 400:
        err = window.data.messages.load.err400;
        break;
      case 401:
        err = window.data.messages.load.err401;
        break;
      case 404:
        err = window.data.messages.load.err404;
        break;
      default:
        err = `${window.data.messages.load.status} ${xhr.status} ${xhr.statusText}`;
    }
    if (err) {
      onError(`${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.send();
};
window.load = load;

})();

(() => {
/*!**********************!*\
  !*** ./js/upload.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const UPLOAD_URL = ` https://21.javascript.pages.academy/keksobooking`;
const upload = (data, onSuccess) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.addEventListener(`load`, () => {
    let err;
    switch (xhr.status) {
      case 200:
        onSuccess(window.data.messages.upload.success);
        break;
      case 400:
        err = window.data.messages.upload.err400;
        break;
      case 401:
        err = window.data.messages.upload.err401;
        break;
      case 404:
        err = window.data.messages.upload.err404;
        break;
      default:
        err = `${window.data.messages.upload.status} ${xhr.status} ${xhr.statusText}`;
    }
    if (err) {
      window.util.showUserMessage(`error`, `${xhr.status} ${xhr.statusText}`);
    }
  });
  xhr.open(`POST`, UPLOAD_URL);
  xhr.send(data);
};
window.upload = upload;

})();

(() => {
/*!************************!*\
  !*** ./js/imgInput.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */

(() => {
  const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
  const showMultipleImages = (images, parent) => {
    const template = document.querySelector(`#preview-img`);
    const imagesArr = Array.from(images);
    imagesArr.forEach((image) => {
      const imageName = image.name.toLowerCase();
      const matches = FILE_TYPES.some(function (ending) {
        return imageName.endsWith(ending);
      });
      if (matches) {
        const reader = new FileReader();
        reader.addEventListener(`load`, function () {
          const markup = template.content.querySelector(`img`).cloneNode(true);
          markup.src = reader.result;
          parent.appendChild(markup);
        });
        reader.readAsDataURL(image);
      }
    });
  };
  const initImgInput = (inputSelector, previewSelector, isMultiple) => {
    const input = document.querySelector(inputSelector);
    const preview = document.querySelector(previewSelector);

    input.addEventListener(`change`, function () {
      if (input.files.length === 1) {
        const file = input.files[0];
        const fileName = file.name.toLowerCase();

        const matches = FILE_TYPES.some(function (ending) {
          return fileName.endsWith(ending);
        });
        if (matches) {
          const reader = new FileReader();

          reader.addEventListener(`load`, function () {
            preview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      } else if (isMultiple) {
        showMultipleImages(input.files, preview);
      }
    });
  };
  window.imgInput = {
    init: initImgInput
  };
})();

})();

(() => {
/*!********************!*\
  !*** ./js/data.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const LOAD_URL = `https://21.javascript.pages.academy/keksobooking/data`;
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

const mapOverlayNode = document.querySelector(`.map__overlay`);
const largestPin = document.querySelector(`.map__pin--main`);
const mapOverlay = {
  y: {
    START: 130,
    END: 630
  },
  x: {
    START: 0 - largestPin.offsetWidth / 2,
    END: mapOverlayNode.offsetWidth - largestPin.offsetWidth / 2
  }
};

const pinTextContent = {
  TITLE: `Уютный очаг на краю города`,
  DESCRIPTION: `Теплое место, последнее пристанище расплавленного ума`
};

const messages = {
  filter: {
    noResult: `Объявления которые соответствуют заданным фильтрам не были найдены`
  },
  load: {
    common: `Произошла ошибка соединения`,
    err400: `Неверный запрос`,
    err401: `Пользователь не авторизован`,
    err404: `Ничего не найдено`,
    status: `Статус ответа:`,
    timeout: {
      pre: `Запрос не успел выполниться за`,
      post: `мс`
    }
  },
  upload: {
    success: `Ваша заявка успешно отправлена`,
    err400: `Неверный запрос`,
    err401: `Пользователь не авторизован`,
    err404: `Ничего не найдено`,
    status: `Статус ответа:`
  }
};

const generateLocation = () => {
  return {
    x: window.util.randomInteger(mapOverlay.x.START, mapOverlay.x.END),
    y: window.util.randomInteger(mapOverlay.y.START + pinOffset.Y, mapOverlay.y.END)
  };
};
const generateFeatures = (houseRandomData) => {
  return houseRandomData.features.filter(() => window.util.randomInteger(0, 1));
};
const generatePhotos = (houseRandomData) => {
  return houseRandomData.photos.filter(() => window.util.randomInteger(0, 1));
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
        price: window.util.randomInteger(999, 9999),
        type: houseRandomData.types[window.util.randomInteger(0, 3)],
        rooms: window.util.randomInteger(1, 5),
        guests: window.util.randomInteger(1, 8),
        checkin: houseRandomData.checkin[window.util.randomInteger(0, 2)],
        checkout: houseRandomData.checkin[window.util.randomInteger(0, 2)],
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
const addFrontId = (houses) => {
  houses.forEach((house, i) => {
    house.frontId = i;
  });
  return houses;
};
const validateHousesResponse = (response) => response.filter((item) => item.offer);
const onSuccess = (response) => {
  window.data.houses = validateHousesResponse(addFrontId(response));
  window.controlPin.setActiveState();
};
const onError = (errorMessage) => {
  window.util.showUserMessage(`error`, errorMessage);
};
const loadHousesData = () => {
  window.load(LOAD_URL, onSuccess, onError);
};
loadHousesData();
window.data = {
  mapOverlay,
  pinOffset,
  mockHouses: generateHousesData(houseDataPatterns, 8),
  messages
};

})();

(() => {
/*!********************!*\
  !*** ./js/card.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const types = {
  flat: `Квартира`,
  bungalow: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
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
      window.util.hideNode(featuresParent);
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
      window.util.hideNode(photosParent);
    }
  };
  const drawCardAvatar = (data) => {
    const avatar = cardMarkup.querySelector(`.popup__avatar`);
    if (data && avatar) {
      avatar.src = data;
    } else if (avatar) {
      window.util.hideNode(avatar);
    }
  };
  const closeCard = () => {
    window.pin.removeActiveStyles();
    window.card.clear();
  };
  const onCardCloseBtnClick = (event) => {
    event.preventDefault();
    closeCard();
  };
  const onDocumentKeydown = (event) => {
    event.preventDefault();
    if (event.key === `Escape`) {
      closeCard();
    }
  };
  const drawCard = (housesData) => {
    window.util.drawTextBlock(`.popup__title`, housesData.offer.title, cardMarkup);
    window.util.drawTextBlock(`.popup__text--address`, housesData.offer.address, cardMarkup);
    window.util.drawTextBlock(`.popup__text--price`, `${housesData.offer.price}₽/ночь`, cardMarkup);
    window.util.drawTextBlock(`.popup__type`, types[housesData.offer.type], cardMarkup);
    window.util.drawTextBlock(`.popup__text--capacity`, `${housesData.offer.rooms} комнаты для ${housesData.offer.guests} гостей`, cardMarkup);
    window.util.drawTextBlock(`.popup__text--time`, `Заезд после ${housesData.offer.checkin}, выезд до ${housesData.offer.checkout}`, cardMarkup);
    drawCardFeatures(housesData.offer.features);
    window.util.drawTextBlock(`.popup__description`, housesData.offer.description, cardMarkup);
    drawCardPhotos(housesData.offer.photos);
    drawCardAvatar(housesData.author.avatar);

    filtersContainer.before(cardMarkup);
    cardMarkup.classList.remove(`hidden`);
    cardCloseBtn.addEventListener(`click`, onCardCloseBtnClick);
    document.addEventListener(`keydown`, onDocumentKeydown);
  };
  const clearCard = () => {
    cardMarkup.classList.add(`hidden`);
    cardCloseBtn.removeEventListener(`click`, onCardCloseBtnClick);
    document.removeEventListener(`click`, onDocumentKeydown);
  };
  return {
    draw: drawCard,
    clear: clearCard
  };
};
window.card = initCard();

})();

(() => {
/*!*******************!*\
  !*** ./js/pin.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const initPins = () => {
  const map = document.querySelector(`#map`);
  const pinsTemplate = document.querySelector(`#pin`);
  const pinsFragment = document.createDocumentFragment();
  const pinsParent = document.querySelector(`.map__pins`);
  const pins = [];
  const drawPins = (pinsStructuredData) => {
    pinsStructuredData.forEach((pinData) => {
      const pinMarkup = pinsTemplate.content.querySelector(`.map__pin`).cloneNode(true);
      const pinAvatar = pinMarkup.querySelector(`img`);
      pinAvatar.src = pinData.author.avatar;
      pinMarkup.style = `left: ${pinData.location.x - window.data.pinOffset.X}px; top: ${pinData.location.y - window.data.pinOffset.Y}px`;
      pinMarkup.attributes.src = pinData.author.avatar;
      pinMarkup.attributes.alt = pinData.offer.title;
      pinMarkup.dataset.frontId = pinData.frontId;
      pinsFragment.appendChild(pinMarkup);
      pins.push(pinMarkup);
    });
    pinsParent.appendChild(pinsFragment);
    pinsParent.addEventListener(`click`, onPinsParentClick);
    pinsParent.addEventListener(`keydown`, onPinsParentKeydown);
  };
  const clearPins = () => {
    pins.forEach((pin) => {
      pin.remove();
    });
  };
  const closePins = () => {
    map.classList.add(`map--faded`);
    clearPins();
    window.controlPin.setMapState(false);
    pinsParent.removeEventListener(`click`, onPinsParentClick);
    pinsParent.removeEventListener(`keydown`, onPinsParentKeydown);
  };
  const removeActiveStyles = () => {
    const showedPins = pinsParent.querySelectorAll(`.map__pin`);
    showedPins.forEach((pin) => {
      pin.classList.remove(`map__pin--active`);
    });
  };
  const onPinsParentClick = (event) => {
    const targetPin = event.target.offsetParent;
    if (targetPin) {
      if (targetPin.dataset.frontId) {
        removeActiveStyles();
        targetPin.classList.add(`map__pin--active`);
        window.card.draw(window.data.houses[event.target.offsetParent.dataset.frontId]);
      }
    }
  };
  const onPinsParentKeydown = (event) => {
    if (event.key === `Enter` && event.target.dataset.frontId) {
      window.card.draw(window.data.houses[event.target.dataset.frontId]);
    }
  };
  return {
    draw: drawPins,
    clear: clearPins,
    close: closePins,
    removeActiveStyles
  };
};

window.pin = initPins();

})();

(() => {
/*!**********************!*\
  !*** ./js/filter.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const priceTypes = {
  LOW: 10000,
  MIDDLE: 50000,
  HIGH: 100000
};
const initialFilterSettings = {
  maxCount: 5,
  type: `any`,
  price: `any`,
  rooms: `any`,
  guests: `any`,
  features: []
};
let filterSettings = Object.assign({}, initialFilterSettings);
const form = document.querySelector(`#pins-filter`);
const initSelectFilter = (name) => {
  const select = form.querySelector(`#housing-${name}`);
  const onTypeSelectInput = (event) => {
    event.preventDefault();
    filterSettings[name] = select.value;
    submitFilter();
  };
  select.addEventListener(`input`, window.debounce(onTypeSelectInput));
};
const initCheckboxFilter = () => {
  const featuresCheckboxesFieldset = form.querySelector(`#housing-features`);
  const featuresCheckboxes = featuresCheckboxesFieldset.querySelectorAll(`input[name="features"]`);
  const onFeatureCheckboxInput = (event) => {
    event.preventDefault();
    const featureName = event.target.id.replace(/filter-/gi, ``);
    if (event.target.checked === true) {
      filterSettings.features.push(featureName);
    } else {
      window.util.findAndRemove(filterSettings.features, featureName);
    }
    submitFilter();
  };
  featuresCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener(`input`, window.debounce(onFeatureCheckboxInput));
  });
};
const convertPrice = (priceNumeric) => {
  let priceType;
  if (priceNumeric < priceTypes.LOW) {
    priceType = `low`;
  } else if (priceTypes.LOW <= priceNumeric && priceNumeric < priceTypes.MIDDLE) {
    priceType = `middle`;
  } else if (priceTypes.MIDDLE <= priceNumeric) {
    priceType = `high`;
  }
  return priceType;
};
const submitFilter = () => {
  let filteredHouses = window.data.houses;
  if (filterSettings.type !== `any`) {
    filteredHouses = filteredHouses.filter((house) => {
      return house.offer.type === filterSettings.type;
    });
  }
  if (filterSettings.price !== `any`) {
    filteredHouses = filteredHouses.filter((house) => {
      return convertPrice(+house.offer.price) === filterSettings.price;
    });
  }
  if (filterSettings.rooms !== `any`) {
    filteredHouses = filteredHouses.filter((house) => {
      return +house.offer.rooms === +filterSettings.rooms;
    });
  }
  if (filterSettings.guests !== `any`) {
    filteredHouses = filteredHouses.filter((house) => {
      return +house.offer.guests === +filterSettings.guests;
    });
  }
  if (filterSettings.features !== []) {
    filteredHouses = filteredHouses.filter((house) => {
      return window.util.contains(house.offer.features, filterSettings.features);
    });
  }
  if (filteredHouses.length === 0) {
    window.util.showUserMessage(`success`, window.data.messages.filter.noResult);
  } else {
    filteredHouses = filteredHouses.slice(0, filterSettings.maxCount);
    window.card.clear();
    window.pin.clear();
    window.pin.draw(filteredHouses);
  }
};
const resetFilters = () => {
  form.reset();
  filterSettings = Object.assign({}, initialFilterSettings);
};
initSelectFilter(`type`);
initSelectFilter(`price`);
initSelectFilter(`rooms`);
initSelectFilter(`guests`);
initCheckboxFilter();
window.filter = {
  submit: submitFilter,
  reset: resetFilters
};

})();

(() => {
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const formNode = document.querySelector(`#ad-form`);
const priceInput = document.querySelector(`#price`);
const INITIAL_MIN_PRICE = 5000;
const validationLimits = {
  MIN_NAME_LENGTH: 30,
  MAX_NAME_LENGTH: 100,
  type: [
    {name: `bungalow`, MIN_PRICE: 0},
    {name: `flat`, MIN_PRICE: 1000},
    {name: `house`, MIN_PRICE: 5000},
    {name: `palace`, MIN_PRICE: 10000}
  ],
  rooms: [
    {
      roomsCount: 1,
      guestOptions: [{value: 1, text: `для 1 гостя`}]
    },
    {
      roomsCount: 2,
      guestOptions: [{value: 1, text: `для 1 гостя`}, {value: 2, text: `для 2 гостей`}]
    },
    {
      roomsCount: 3,
      guestOptions: [{value: 1, text: `для 1 гостя`}, {value: 3, text: `для 3 гостей`}, {value: 2, text: `для 2 гостей`}]
    },
    {
      roomsCount: 100,
      guestOptions: [{value: 1, text: `не для гостей`}]
    }
  ],
  minPrice: 5000
};
const initRoomsValidate = () => {
  const roomsSelect = document.querySelector(`#room_number`);
  const capacitySelect = document.querySelector(`#capacity`);
  const capacityOption = document.querySelector(`#capacity option`);
  const roomsValidate = () => {
    validationLimits.rooms.forEach((limit) => {
      if (limit.roomsCount === +roomsSelect.value) {
        const guestOptionsFragment = document.createDocumentFragment();
        limit.guestOptions.forEach((guestOption) => {
          const guestOptionMarkup = capacityOption.cloneNode();
          guestOptionMarkup.innerText = guestOption.text;
          guestOptionMarkup.value = guestOption.value;
          guestOptionsFragment.appendChild(guestOptionMarkup);
        });
        capacitySelect.innerHTML = ``;
        capacitySelect.appendChild(guestOptionsFragment);
      }
    });
  };

  const onRoomsSelectInput = () => {
    roomsValidate();
  };

  roomsSelect.addEventListener(`input`, onRoomsSelectInput);
  roomsValidate();
};
const initCheckinValidate = () => {
  const checkinInput = document.querySelector(`#timein`);
  const checkoutInput = document.querySelector(`#timeout`);
  const updCheckoutValue = () => {
    checkoutInput.value = checkinInput.value;
  };
  const updCheckinValue = () => {
    checkinInput.value = checkoutInput.value;
  };
  const onCheckinInput = () => {
    updCheckoutValue();
  };
  checkinInput.addEventListener(`input`, onCheckinInput);
  checkoutInput.addEventListener(`input`, updCheckinValue);
};
const initMinPriceValidate = () => {
  const typeSelect = document.querySelector(`#type`);
  const typeMinPriceValidate = (event) => {
    validationLimits.type.forEach((type) => {
      if (type.name === event.target.value) {
        validationLimits.minPrice = type.MIN_PRICE;
        priceInput.attributes.min = validationLimits.minPrice;
        priceInput.placeholder = validationLimits.minPrice;
      }
    });
  };
  const minPriceValidate = () => {
    const value = priceInput.value;

    if (value < validationLimits.minPrice) {
      priceInput.setCustomValidity(`Минимальная цена выбранного типа апартаментов ${validationLimits.minPrice} руб.`);
    } else {
      priceInput.setCustomValidity(``);
    }

    priceInput.reportValidity();
  };
  const onTypeSelectInput = (event) => {
    typeMinPriceValidate(event);
    minPriceValidate();
  };
  const onPriceInput = () => {
    minPriceValidate();
  };
  typeSelect.addEventListener(`input`, onTypeSelectInput);
  priceInput.addEventListener(`input`, onPriceInput);
};
const resetMinPrice = () => {
  validationLimits.minPrice = INITIAL_MIN_PRICE;
  priceInput.placeholder = INITIAL_MIN_PRICE;
};
const initTitleValidate = () => {
  const titleInput = document.querySelector(`#title`);
  const onTitleInput = () => {
    const valueLength = titleInput.value.length;

    if (valueLength < validationLimits.MIN_NAME_LENGTH) {
      titleInput.setCustomValidity(`Ещё ${validationLimits.MIN_NAME_LENGTH - valueLength} симв.`);
    } else if (valueLength > validationLimits.MAX_NAME_LENGTH) {
      titleInput.setCustomValidity(`Удалите лишние ${valueLength - validationLimits.MAX_NAME_LENGTH} симв.`);
    } else {
      titleInput.setCustomValidity(``);
    }

    titleInput.reportValidity();
  };
  titleInput.addEventListener(`input`, onTitleInput);
};
const initSubmit = () => {
  const onSubmit = (event) => {
    event.preventDefault();
    window.upload(new FormData(formNode), (response) => {
      window.pin.close();
      window.card.clear();
      window.filter.reset();
      resetMinPrice();
      window.util.showUserMessage(`success`, response);
    });
  };
  formNode.addEventListener(`submit`, onSubmit);
};
const initResetBtn = () => {
  const resetBtn = document.querySelector(`.ad-form__reset`);
  const resetForm = () => {
    formNode.reset();
    resetMinPrice();
  };
  const onResetBtnClick = (event) => {
    event.preventDefault();
    resetForm();
    window.pin.close();
    window.filter.reset();
    window.card.clear();
    window.controlPin.setAddress();
  };
  resetBtn.addEventListener(`click`, onResetBtnClick);
};
window.imgInput.init(`.ad-form__field input`, `.ad-form-header__preview img`);
window.imgInput.init(`.ad-form__upload input`, `.ad-form__photo`, true);
initResetBtn();
window.form = {
  rooms: {
    initValidation: initRoomsValidate
  },
  checkin: {
    initValidation: initCheckinValidate
  },
  minPrice: {
    initValidation: initMinPriceValidate
  },
  title: {
    initValidation: initTitleValidate
  },
  initSubmit
};

})();

(() => {
/*!**************************!*\
  !*** ./js/controlPin.js ***!
  \**************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const ADDRESS_REGEXP = /[^-0-9]/gim;
const markerOffset = {
  X: 25,
  Y: 70
};
const controlPin = document.querySelector(`.map__pin--main`);
const controlPinInitPosition = {
  LEFT: controlPin.style.left,
  TOP: controlPin.style.top
};
const setDisabledState = () => {
  window.util.hideNode(controlPin);
};
const setActiveState = () => {
  window.util.showNode(controlPin);
};
const activateFiltersForm = (state) => {
  const filterForm = document.querySelector(`.map__filters`);
  const filters = filterForm.querySelectorAll(`select, input`);

  filters.forEach((filter) => {
    window.util.changeDisabledAttr(filter, !state);
  });
};
const activateOrderForm = (state) => {
  const form = document.querySelector(`.ad-form`);
  const formFieldsetArr = form.querySelectorAll(`fieldset`);

  formFieldsetArr.forEach((formFieldset) => {
    window.util.changeDisabledAttr(formFieldset, !state);
  });

  if (state) {
    form.classList.remove(`ad-form--disabled`);
    window.filter.submit();
    window.form.rooms.initValidation();
    window.form.minPrice.initValidation();
    window.form.title.initValidation();
    window.form.checkin.initValidation();
    window.form.initSubmit();
  } else {
    form.classList.add(`ad-form--disabled`);
    form.reset();
  }
};
const setAddress = () => {
  const addressInput = document.querySelector(`#address`);
  const coordinates = {
    X: +controlPin.style.left.replace(ADDRESS_REGEXP, ``) + markerOffset.X,
    Y: +controlPin.style.top.replace(ADDRESS_REGEXP, ``) + markerOffset.Y
  };
  addressInput.value = `${coordinates.X}, ${coordinates.Y}`;
};
const setMapState = (state) => {
  const onPinMousedown = (event) => {
    if (event.button === 0) {
      setMapState(true);
    }
  };
  const onPinKeydown = (event) => {
    if (event.key === `Enter`) {
      setMapState(true);
    }
  };
  if (state) {
    const map = document.querySelector(`.map`);
    map.classList.remove(`map--faded`);
    activateOrderForm(true);
    activateFiltersForm(true);
    window.form.rooms.initValidation();
  } else {
    activateOrderForm(false);
    activateFiltersForm(false);
    controlPin.addEventListener(`mousedown`, onPinMousedown, {once: true});
    controlPin.addEventListener(`keydown`, onPinKeydown, {once: true});
    controlPin.style.left = controlPinInitPosition.LEFT;
    controlPin.style.top = controlPinInitPosition.TOP;
    setAddress();
  }
};
const initControlPin = () => {
  const initDrag = () => {
    const moveControlPin = (event) => {
      let startCoords = {
        x: event.clientX,
        y: event.clientY
      };

      const onMouseMove = (moveEvt) => {
        moveEvt.preventDefault();
        const shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        controlPin.style.top = `${window.util.mapOffsetCheck(controlPin.offsetTop - shift.y, `y`)}px`;
        controlPin.style.left = `${window.util.mapOffsetCheck(controlPin.offsetLeft - shift.x, `x`)}px`;
      };
      const onMouseUp = (upEvt) => {
        upEvt.preventDefault();
        document.removeEventListener(`mousemove`, onMouseMove);
        document.removeEventListener(`mouseup`, onMouseUp);
        setAddress();
      };

      document.addEventListener(`mousemove`, onMouseMove);
      document.addEventListener(`mouseup`, onMouseUp);
    };
    const onControlPinMousedown = (event) => {
      event.preventDefault();
      if (event.button === 0) {
        moveControlPin(event);
      }
    };
    controlPin.addEventListener(`mousedown`, onControlPinMousedown);
  };
  setDisabledState();
  setMapState(false);
  setAddress();
  initDrag();
};

window.controlPin = {
  init: initControlPin,
  setActiveState,
  setMapState,
  setAddress
};

})();

(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


window.controlPin.init();

})();

/******/ })()
;