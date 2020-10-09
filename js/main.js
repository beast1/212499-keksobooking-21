'use strict';

window.initPin = () => {
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
      initTitleValidate();
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
      mainPin.removeEventListener(`mousedown`, onPinMousedown);
      mainPin.removeEventListener(`keydown`, onPinKeydown);
    } else {
      activateForm(false);
      mainPin.addEventListener(`mousedown`, onPinMousedown);
      mainPin.addEventListener(`keydown`, onPinKeydown);
    }
  };

  const setAddress = () => {
    const addressInput = document.querySelector(`#address`);
    const coordinates = {
      X: +mainPin.style.left.replace(/[^-0-9]/gim, ``),
      Y: +mainPin.style.top.replace(/[^-0-9]/gim, ``)
    };
    addressInput.value = `${coordinates.X}, ${coordinates.Y}`;
  };

  const initRoomsValidate = () => {
    const roomLimits = [
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
        guestOptions: [{value: 1, text: `для 1 гостя`}, {value: 2, text: `для 2 гостей`}, {
          value: 3,
          text: `для 3 гостей`
        }]
      },
      {
        roomsCount: 100,
        guestOptions: [{value: 1, text: `не для гостей`}]
      }
    ];

    const roomsSelect = document.querySelector(`#room_number`);
    const capacitySelect = document.querySelector(`#capacity`);
    const capacityOption = document.querySelector(`#capacity option`);
    const roomsValidate = () => {
      roomLimits.forEach((limit) => {
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

  const initTitleValidate = () => {
    const MIN_NAME_LENGTH = 30;
    const MAX_NAME_LENGTH = 100;
    const titleInput = document.querySelector(`#title`);
    const onTitleInput = () => {
      const valueLength = titleInput.value.length;

      if (valueLength < MIN_NAME_LENGTH) {
        titleInput.setCustomValidity(`Ещё ${MIN_NAME_LENGTH - valueLength} симв.`);
      } else if (valueLength > MAX_NAME_LENGTH) {
        titleInput.setCustomValidity(`Удалите лишние ${valueLength - MAX_NAME_LENGTH} симв.`);
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
