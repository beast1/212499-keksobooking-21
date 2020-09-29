'use strict';

const dataPatterns = {
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
  TITLE: `строка, заголовок предложения`,
  DESCRIPTION: `строка с описанием`
};

const generateLocation = () => {
  const mapOverlay = document.querySelector(`.map__overlay`);
  return {
    x: window.randomInteger(markerOffset.X, mapOverlay.offsetWidth),
    y: window.randomInteger(mapOverlayY.START + markerOffset.Y, mapOverlayY.END)
  };
};

const generateFeatures = (markerRandomData) => {
  // const features = [];
  // markerRandomData.features.forEach((feature) => {
  //   if (window.randomInteger(0, 1)) {
  //     features.push(feature);
  //   }
  // });
  return markerRandomData.features.map((feature) => {
    if (window.randomInteger(0, 1)) {
      return feature;
    }
  });
};

const generateMarkers = (markerRandomData, markersCount) => {
  const markers = [];

  for (let i = 0; i < markersCount; i++) {
    const location = generateLocation();
    const features = generateFeatures(markerRandomData);

    markers.push({
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: markerTextContent.TITLE,
        address: `${location.x}, ${location.y}`,
        price: window.randomInteger(999, 9999),
        type: markerRandomData.types[window.randomInteger(0, 3)],
        rooms: window.randomInteger(1, 5),
        guests: window.randomInteger(1, 8),
        checkin: markerRandomData.checkin[window.randomInteger(0, 2)],
        checkout: markerRandomData.checkin[window.randomInteger(0, 2)],
        features,
        description: markerTextContent.DESCRIPTION,
        photos: markerRandomData.photos[window.randomInteger(0, 2)]
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

drawMarkers(generateMarkers(dataPatterns, 8));
showMap();
