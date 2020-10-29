'use strict';

(() => {
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
      filter.disabled = !state;
    });
  };
  const activateOrderForm = (state) => {
    const form = document.querySelector(`.ad-form`);
    const formFieldsetArr = form.querySelectorAll(`fieldset`);

    formFieldsetArr.forEach((formFieldset) => {
      formFieldset.disabled = !state;
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
      X: +controlPin.style.left.replace(/[^-0-9]/gim, ``) + markerOffset.X,
      Y: +controlPin.style.top.replace(/[^-0-9]/gim, ``) + markerOffset.Y
    };
    addressInput.value = `${coordinates.X}, ${coordinates.Y}`;
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
      const moveControlPin = (e) => {
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
      const onControlPinMousedown = (e) => {
        e.preventDefault();
        if (e.button === 0) {
          moveControlPin(e);
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
