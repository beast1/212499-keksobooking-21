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
  DESCRIPTION: `Теплое место, последнее пристанище расплавленного ума`
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
  if (node && text) {
    node.textContent = text;
  } else if (node) {
    node.style.display = `none`;
  }
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

const drawCardPhotos = (data, parent = document) => {
  const photosParent = parent.querySelector(`.popup__photos`);
  const photosFragment = document.createDocumentFragment();
  data.forEach((photo) => {
    const photoMarkup = photosParent.querySelector(`.popup__photo`).cloneNode(true);
    photoMarkup.src = photo;
    photosFragment.appendChild(photoMarkup);
  });
  photosParent.innerHTML = ``;
  photosParent.appendChild(photosFragment);
};

const drawCardAvatar = (data, parent = document) => {
  const avatar = parent.querySelector(`.popup__avatar`);
  avatar.src = data;
};

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
  drawTextBlock(`.popup__description`, housesData.offer.description, cardMarkup);
  drawCardPhotos(housesData.offer.photos, cardMarkup);
  drawCardAvatar(housesData.author.avatar, cardMarkup);
  // todo Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  filtersContainer.before(cardMarkup);
};

const housesData = generateHousesData(houseDataPatterns, 8);
drawCard(housesData[0]);

drawMarkers(housesData);
showMap();
