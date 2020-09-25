'use strict';

const data = {
  types: [`palace`, `flat`, `house`, `bungalow`],
  checkin: [`12:00`, `13:00`, `14:00`],
  features: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  photos: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]
};

const generateDots = (dotsRandomData, dotsCount) => {
  const dots = [];
  const avatars = [];

  for (let i = 0; i < dotsCount; i++) {
    avatars.push(`img/avatars/user0${i + 1}.png`)
  }

  console.log(avatars);

  for (let i = 0; i < dotsCount; i++) {
    const location = {
      x: window.randomInteger(130, 630),
      y: window.randomInteger(130, 630)
    }
    const features = [];
    const avatarIndex = window.randomInteger(0,7);

    dotsRandomData.features.forEach((feature) => {
      if (window.randomInteger(0, 1)) {
        features.push(feature);
      }
    });

    dots.push({
      author: {
        avatar: `img/avatars/user0${avatarIndex}.png` //todo не должны повторятся
      },
      offer: {
        title: `строка, заголовок предложения`,
        address: `${location.x}, ${location.y}`,
        price: window.randomInteger(999, 9999),
        type: dotsRandomData.types[window.randomInteger(0, 3)],
        rooms: window.randomInteger(1, 5),
        guests: window.randomInteger(1, 8),
        checkin: dotsRandomData.checkin[window.randomInteger(0, 2)],
        checkout: dotsRandomData.checkin[window.randomInteger(0, 2)],
        features: features,
        description: `строка с описанием`,
        photos: dotsRandomData.photos[window.randomInteger(0, 2)]
      },
      location: {
        x: location.x,
        y: location.y
      }
    });

    avatars.splice(avatarIndex, avatarIndex);
  }

  return dots;
};

const map = document.querySelector('.map');
map.classList.remove('map--faded');

const drawDots = (dotsStructuredData) => {
  console.log(dotsStructuredData);
  const dotsTemplate = document.querySelector(`#pin`);
  const dotsFragment = document.createDocumentFragment();
  const dotsParent = document.querySelector(`.map__pins`);

  dotsStructuredData.forEach((dotData) => {
    const dotMarkup = dotsTemplate.content.querySelector('.map__pin').cloneNode(true);
    dotMarkup.style = `left: ${dotData.location.x}px; top: ${dotData.location.y}px`; //todo добавить смещение
    dotMarkup.attributes.src = dotData.author.avatar;
    dotMarkup.attributes.alt = dotData.offer.title;
    dotsFragment.appendChild(dotMarkup);
  });

  dotsParent.appendChild(dotsFragment);
};

drawDots(generateDots(data, 8));
