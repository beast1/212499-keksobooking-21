'use strict';

window.initPin = () => {
  const markerOffset = {
    X: 25,
    Y: 70
  };
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
    ]
  };
  const mainPin = document.querySelector(`.map__pin--main`);
  const activateForm = (state) => {
    const form = document.querySelector(`.ad-form`);
    const formFieldsetArr = form.querySelectorAll(`fieldset`);

    formFieldsetArr.forEach((formFieldset) => {
      formFieldset.disabled = !state;
    });

    if (state) {
      form.classList.remove(`ad-form--disabled`);
      window.pins.draw(window.housesData);
      initRoomsValidate();
      initMinPriceValidate();
      initTitleValidate();
      initCheckinValidate();
    } else {
      form.classList.add(`ad-form--disabled`);
    }
  };

  const setMapState = (state) => {
    const onPinMousedown = (e) => {
      if (e.button === 0) {
        setMapState(true);
      }
    };
    const onPinKeydown = (e) => {
      if (e.key === `Enter`) {
        setMapState(true);
      }
    };
    if (state) {
      const map = document.querySelector(`.map`);
      map.classList.remove(`map--faded`);
      activateForm(true);
      initRoomsValidate();
    } else {
      activateForm(false);
      mainPin.addEventListener(`mousedown`, onPinMousedown, {once: true});
      mainPin.addEventListener(`keydown`, onPinKeydown, {once: true});
    }
  };

  const setAddress = () => {
    const addressInput = document.querySelector(`#address`);
    const coordinates = {
      X: +mainPin.style.left.replace(/[^-0-9]/gim, ``) + markerOffset.X,
      Y: +mainPin.style.top.replace(/[^-0-9]/gim, ``) + markerOffset.Y
    };
    addressInput.value = `${coordinates.X}, ${coordinates.Y}`;
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
    const priceInput = document.querySelector(`#price`);
    let currentMinPrice;
    const typeMinPriceValidate = (e) => {
      validationLimits.type.forEach((type) => {
        if (type.name === e.target.value) {
          currentMinPrice = type.MIN_PRICE;
          priceInput.attributes.min = currentMinPrice;
          priceInput.attributes.placeholder = currentMinPrice;
        }
      });
    };
    const minPriceValidate = () => {
      const value = priceInput.value;

      if (value < currentMinPrice) {
        priceInput.setCustomValidity(`Минимальная цена выбранного типа апартаментов ${currentMinPrice} руб.`);
      } else {
        priceInput.setCustomValidity(``);
      }

      priceInput.reportValidity();
    };
    const onTypeSelectInput = (e) => {
      typeMinPriceValidate(e);
      minPriceValidate();
    };
    const onPriceInput = () => {
      minPriceValidate();
    };
    typeSelect.addEventListener(`input`, onTypeSelectInput);
    priceInput.addEventListener(`input`, onPriceInput);
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

  setAddress();
  setMapState(false);
};

window.initPin();
