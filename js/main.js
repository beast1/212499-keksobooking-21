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
      window.drawCard(window.housesData[0]);
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

  setAddress();
  setMapState(false);
};

window.initPin();


//для меток похожих объявлений должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
// Доработайте проект так, чтобы пользователь мог открыть карточку любого доступного объявления;
//
// Добавьте возможность закрытия карточки с подробной информацией по нажатию клавиши Esc и клике по иконке закрытия;
//
// Добавьте поддержку открытия карточки объявления с клавиатуры. Карточка объявления для выбранной метки открывается при нажатии на клавишу Enter.
//
//   Сделайте так, чтобы одновременно могла быть открыта только одна карточка объявления.
//
//   Обратите внимание, что у главной метки .map__pin--main не может быть карточки объявления.
