'use strict';

(() => {
  const URL = ` https://21.javascript.pages.academy/keksobooking`;
  const upload = (data, onSuccess) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.addEventListener(`load`, () => {
      let err;
      switch (xhr.status) {
        case 200:
          onSuccess(`Ваша заявка успешно отправлена`);
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
        window.util.showUserMessage(`error`, `${xhr.status} ${xhr.statusText}`);
      }
    });
    xhr.open(`POST`, URL);
    xhr.send(data);
  };
  window.upload = upload;
})();
