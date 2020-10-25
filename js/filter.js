'use strict';

(() => {
  const priceTypes = {
    LOW: 10000,
    MIDDLE: 50000,
    HIGH: 100000
  };
  const filterSettings = {
    MAX_COUNT: 5,
    type: `any`,
    price: `any`,
    rooms: `any`,
    guests: `any`,
    features: []
  };
  const form = document.querySelector(`#pins-filter`);
  const typeSelect = form.querySelector(`#housing-type`);
  const priceSelect = form.querySelector(`#housing-price`);
  const roomsSelect = form.querySelector(`#housing-rooms`);
  const guestsSelect = form.querySelector(`#housing-guests`);
  const featuresCheckboxesFieldset = form.querySelector(`#housing-features`);
  const featuresCheckboxes = featuresCheckboxesFieldset.querySelectorAll(`input[name="features"]`);
  const submitFilter = () => {
    console.log(window.data.houses);
    //фильтруем по типу
    let filteredHouses = window.data.houses.filter((house) => {
      return filterSettings.type === `any` || house.offer.type === filterSettings.type;
    });
    //фильтруем по цене
    const convertPrice = (priceNumeric) => {
      let priceType;
      if (priceNumeric < priceTypes.LOW) {
        priceType = `low`;
      } else if (priceTypes.LOW <= priceNumeric && priceNumeric < priceTypes.MIDDLE) {
        priceType = `middle`;
      } else if (priceTypes.MIDDLE <= priceNumeric) {
        priceType = `high`;
      }
      return priceType;
    };
    if (filterSettings.price !== `any`) {
      filteredHouses = filteredHouses.filter((house) => {
        return convertPrice(+house.offer.price) === filterSettings.price;
      });
      console.log(filteredHouses);
    }
    //фильтруем по кол-ву комнат
    if (filterSettings.rooms !== `any`) {
      filteredHouses = filteredHouses.filter((house) => {
        return +house.offer.rooms === +filterSettings.rooms;
      });
    }
    //фильтруем по кол-ву гостей
    if (filterSettings.guests !== `any`) {
      filteredHouses = filteredHouses.filter((house) => {
        return +house.offer.guests === +filterSettings.guests;
      });
    }
    //фильтруем по наличию фич
    if (filterSettings.features !== []) {
      filteredHouses = filteredHouses.filter((house) => {
        return window.util.contains(house.offer.features, filterSettings.features);
      });
    }
    //обрезаем лишнее если есть
    if (filteredHouses.length === 0) {
      window.util.showUserMessage(`success`, window.data.messages.filter.noResult);
    } else {
      filteredHouses = filteredHouses.slice(0, filterSettings.MAX_COUNT);
      window.card.clear();
      window.pin.clear();
      window.pin.draw(filteredHouses);
    }
  };
  const onTypeSelectInput = (e) => {
    e.preventDefault();
    filterSettings.type = typeSelect.value;
    submitFilter();
  };
  const onPriceSelectInput = (e) => {
    e.preventDefault();
    filterSettings.price = priceSelect.value;
    submitFilter();
  };
  const onRoomsSelectInput = (e) => {
    e.preventDefault();
    filterSettings.rooms = roomsSelect.value;
    submitFilter();
  };
  const onGuestsSelectInput = (e) => {
    e.preventDefault();
    filterSettings.guests = guestsSelect.value;
    submitFilter();
  };
  const onFeatureCheckboxInput = (e) => {
    e.preventDefault();
    const featureName = e.target.id.replace(/filter-/gi, ``);
    if (e.target.checked === true) {
      filterSettings.features.push(featureName);
    } else {
      window.util.findAndRemove(filterSettings.features, featureName);
    }
    submitFilter();
  };
  typeSelect.addEventListener(`input`, onTypeSelectInput);
  priceSelect.addEventListener(`input`, onPriceSelectInput);
  roomsSelect.addEventListener(`input`, onRoomsSelectInput);
  guestsSelect.addEventListener(`input`, onGuestsSelectInput);
  featuresCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener(`input`, onFeatureCheckboxInput);
  });
  window.filter = {
    submit: submitFilter
  };
})();
