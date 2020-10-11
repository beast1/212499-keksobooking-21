'use strict';

(() => {
  const markerOffset = {
    X: 25,
    Y: 70
  };
  const initControlPin = () => {
    const mainPin = document.querySelector(`.map__pin--main`);
    const activateForm = (state) => {
      const form = document.querySelector(`.ad-form`);
      const formFieldsetArr = form.querySelectorAll(`fieldset`);

      formFieldsetArr.forEach((formFieldset) => {
        formFieldset.disabled = !state;
      });

      if (state) {
        form.classList.remove(`ad-form--disabled`);
        window.pin.draw(window.data.houses);
        window.form.rooms.initValidation();
        window.form.minPrice.initValidation();
        window.form.title.initValidation();
        window.form.checkin.initValidation();
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
        window.form.rooms.initValidation();
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
    setAddress();
    setMapState(false);
  };

  window.controlPin = {
    init: initControlPin
  };
})();
