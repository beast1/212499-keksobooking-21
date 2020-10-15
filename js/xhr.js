'use strict';

(() => {
  const onError = (message) => {
    console.error(message);
  };
  const onSuccess = (response) => {
    console.log(response);
  };
  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, `https://21.javascript.pages.academy/keksobooking/data`);
  xhr.responseType = `json`;
  xhr.timeout = 10000;
  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });
  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });
  xhr.addEventListener(`load`, () => {
    let err;
    switch (xhr.status) {
      case 200:
        onSuccess(xhr.response);
        break;
      case 400:
        err = `Неверный запрос`;
        break;
      case 401:
        err = `Пользователь не авторизован`;
        break;
      case 404:
        err = `Ничего не найдено`;
        break;
      default:
        err = `Статус ответа: ${xhr.status} ${xhr.statusText}`;
    }
    if (err) {
      onError(`${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.send();
})();
