'use strict';

(() => {
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
  window.data = {
    mapOverlay: mapOverlay,
    pinOffset,
    houses: generateHousesData(houseDataPatterns, 8)
  };
})();
