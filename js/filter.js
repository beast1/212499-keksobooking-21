'use strict';

(() => {
  const filterSettings = {
    MAX_COUNT: 5,
    type: `any`
  };
  const form = document.querySelector(`#pins-filter`);
  const typeInput = form.querySelector(`#housing-type`);
  const submitFilter = () => {
    let filteredHouses = window.data.houses.filter((house) => {
      return filterSettings.type === `any` || house.offer.type === filterSettings.type;
    });
    if (filteredHouses.length === 0) {
      window.util.showUserMessage(`success`, window.data.messages.filter.noResult);
    } else {
      filteredHouses = filteredHouses.slice(0, filterSettings.MAX_COUNT);
      window.card.clear();
      window.pin.clear();
      window.pin.draw(filteredHouses);
    }
  };
  const onTypeInput = (e) => {
    e.preventDefault();
    filterSettings.type = typeInput.value;
    submitFilter();
  };
  typeInput.addEventListener(`input`, onTypeInput);
  window.filter = {
    submit: submitFilter
  };
})();
