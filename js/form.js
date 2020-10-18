'use strict';

(() => {
  const formNode = document.querySelector(`#ad-form`);
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
    roomsValidate();
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
  const initSubmit = () => {
    const onSubmit = (e) => {
      e.preventDefault();
      window.upload(new FormData(formNode), (response) => {
        window.pin.clear();
        window.util.showUserMessage(`success`, response);
      });
    };
    formNode.addEventListener(`submit`, onSubmit);
  };
  const initResetBtn = () => {
    const resetBtn = document.querySelector(`.ad-form__reset`);
    const resetForm = () => {
      formNode.reset();
      window.util.showUserMessage(`success`, `Форма очищена`);
    };
    const onResetBtnClick = (e) => {
      e.preventDefault();
      resetForm();
      window.controlPin.setAddress();
    };
    resetBtn.addEventListener(`click`, onResetBtnClick);
  };
  initResetBtn();
  window.form = {
    rooms: {
      initValidation: initRoomsValidate
    },
    checkin: {
      initValidation: initCheckinValidate
    },
    minPrice: {
      initValidation: initMinPriceValidate
    },
    title: {
      initValidation: initTitleValidate
    },
    initSubmit
  };
})();
