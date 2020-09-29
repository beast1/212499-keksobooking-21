'use strict';

const houseDataPatterns = {
  types: [`palace`, `flat`, `house`, `bungalow`],
  checkin: [`12:00`, `13:00`, `14:00`],
  features: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  photos: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]
};

const markerOffset = {
  X: 25,
  Y: 70
};

const mapOverlayY = {
  START: 130,
  END: 630
};

const markerTextContent = {
  TITLE: `Уютный очаг на краю города`,
  DESCRIPTION: `строка с описанием`
};

const generateLocation = () => {
  const mapOverlay = document.querySelector(`.map__overlay`);
  return {
    x: window.randomInteger(markerOffset.X, mapOverlay.offsetWidth),
    y: window.randomInteger(mapOverlayY.START + markerOffset.Y, mapOverlayY.END)
  };
};

const generateFeatures = (houseRandomData) => {
  return houseRandomData.features.filter(() => window.randomInteger(0, 1));
};

const generatePhotos = (houseRandomData) => {
  return houseRandomData.photos.filter(() => window.randomInteger(0, 1));
};

const generateHousesData = (houseRandomData, markersCount) => {
  const markers = [];

  for (let i = 0; i < markersCount; i++) {
    const location = generateLocation();

    markers.push({
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: markerTextContent.TITLE,
        address: `${location.x}, ${location.y}`,
        price: window.randomInteger(999, 9999),
        type: houseRandomData.types[window.randomInteger(0, 3)],
        rooms: window.randomInteger(1, 5),
        guests: window.randomInteger(1, 8),
        checkin: houseRandomData.checkin[window.randomInteger(0, 2)],
        checkout: houseRandomData.checkin[window.randomInteger(0, 2)],
        features: generateFeatures(houseRandomData),
        description: markerTextContent.DESCRIPTION,
        photos: generatePhotos(houseRandomData)
      },
      location: {
        x: location.x,
        y: location.y
      }
    });
  }

  return markers;
};

const showMap = () => {
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);
};

const drawMarkers = (markersStructuredData) => {
  const markersTemplate = document.querySelector(`#pin`);
  const markersFragment = document.createDocumentFragment();
  const markersParent = document.querySelector(`.map__pins`);

  markersStructuredData.forEach((markerData) => {
    const markerMarkup = markersTemplate.content.querySelector(`.map__pin`).cloneNode(true);
    markerMarkup.style = `left: ${markerData.location.x - markerOffset.X}px; top: ${markerData.location.y - markerOffset.Y}px`;
    markerMarkup.attributes.src = markerData.author.avatar;
    markerMarkup.attributes.alt = markerData.offer.title;
    markersFragment.appendChild(markerMarkup);
  });

  markersParent.appendChild(markersFragment);
};

const types = {
  flat: `Квартира`,
  bungalow: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
};

const drawTextBlock = (className, text, parent = document) => {
  const node = parent.querySelector(className);
  node.textContent = text;
};

const drawCardFeatures = (data, parent = document) => {
  const featuresParent = parent.querySelector(`.popup__features`);
  const featuresFragment = document.createDocumentFragment();
  data.forEach((feature) => {
    const featureMarkup = featuresParent.querySelector(`.popup__feature`).cloneNode(true);
    featureMarkup.className = `popup__feature popup__feature--${feature}`;
    featuresFragment.appendChild(featureMarkup);
  });
  featuresParent.innerHTML = ``;
  featuresParent.appendChild(featuresFragment);
};

// const drawListBlock = (className, dataArr, parent = document, callback) => {
//   const listParent = parent.querySelector(className);
//   const featuresFragment = document.createDocumentFragment();
//   // передать элемент dataArr в коллбек
//   dataArr.forEach(callback());
//   // housesData.offer.features.forEach((feature) => {
//   //   const featureMarkup = featuresParent.querySelector(`.popup__feature`).cloneNode(true);
//   //   featureMarkup.className = `popup__feature popup__feature--${feature}`;
//   //   featuresFragment.appendChild(featureMarkup);
//   // });
//   listParent.innerHTML = ``;
//   listParent.appendChild(featuresFragment);
// };

const drawCard = (housesData) => {
  const cardTemplate = document.querySelector(`#card`);
  const cardMarkup = cardTemplate.content.querySelector(`.map__card`).cloneNode(true);
  const filtersContainer = document.querySelector(`.map__filters-container`);
  console.log(filtersContainer);

  drawTextBlock(`.popup__title`, housesData.offer.title, cardMarkup);
  drawTextBlock(`.popup__text--address`, housesData.offer.address, cardMarkup);
  drawTextBlock(`.popup__text--price`, `${housesData.offer.price}₽/ночь`, cardMarkup);
  drawTextBlock(`.popup__type`, types[housesData.offer.type], cardMarkup);
  drawTextBlock(`.popup__text--capacity`, `${housesData.offer.rooms} комнаты для ${housesData.offer.guests} гостей`, cardMarkup);
  drawTextBlock(`.popup__text--time`, `Заезд после ${housesData.offer.checkin}, выезд до ${housesData.offer.checkout}`, cardMarkup);
  drawCardFeatures(housesData.offer.features, cardMarkup);
  const description = cardMarkup.querySelector(`.popup__description`);
  description.textContent = housesData.offer.description;
  // В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
  const photosParent = cardMarkup.querySelector(`.popup__photos`);
  const photosFragment = document.createDocumentFragment();
  housesData.offer.photos.forEach((photo) => {
    const photoMarkup = photosParent.querySelector(`.popup__photo`).cloneNode(true);
    photoMarkup.src = photo;
    photosFragment.appendChild(photoMarkup);
  });
  photosParent.innerHTML = ``;
  photosParent.appendChild(photosFragment);
  // Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
  const avatar = cardMarkup.querySelector(`.popup__avatar`);
  avatar.src = housesData.author.avatar;
  console.log(cardMarkup);
  // todo Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.

  // Вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container
  filtersContainer.before(cardMarkup);
};

const housesData = generateHousesData(houseDataPatterns, 8);
drawCard(housesData[0]);

drawMarkers(housesData);
showMap();
