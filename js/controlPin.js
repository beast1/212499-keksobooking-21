'use strict';

(() => {
  const markerOffset = {
    X: 25,
    Y: 70
  };
  const initControlPin = () => {
    const controlPin = document.querySelector(`.map__pin--main`);
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
        controlPin.addEventListener(`mousedown`, onPinMousedown, {once: true});
        controlPin.addEventListener(`keydown`, onPinKeydown, {once: true});
      }
    };
    const setAddress = () => {
      const addressInput = document.querySelector(`#address`);
      const coordinates = {
        X: +controlPin.style.left.replace(/[^-0-9]/gim, ``) + markerOffset.X,
        Y: +controlPin.style.top.replace(/[^-0-9]/gim, ``) + markerOffset.Y
      };
      addressInput.value = `${coordinates.X}, ${coordinates.Y}`;
    };
    const initDrag = () => {
      const onControlPinMousedown = (e) => {
        e.preventDefault();
        let startCoords = {
          x: e.clientX,
          y: e.clientY
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

          controlPin.style.top = (controlPin.offsetTop - shift.y) + `px`;
          controlPin.style.left = (controlPin.offsetLeft - shift.x) + `px`;
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
      controlPin.addEventListener(`mousedown`, onControlPinMousedown);
    };
    setAddress();
    setMapState(false);
    initDrag();
  };

  window.controlPin = {
    init: initControlPin
  };
})();
