'use strict';

const loadParams = {
  METHOD: `GET`,
  RESPONSE_TYPE: `json`,
  TIMEOUT: `10000`
};
const load = (url, onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.open(loadParams.METHOD, url);
  xhr.responseType = loadParams.RESPONSE_TYPE;
  xhr.timeout = loadParams.TIMEOUT;
  xhr.addEventListener(`error`, function () {
    onError(window.data.messages.load.common);
  });
  xhr.addEventListener(`timeout`, function () {
    onError(`${window.data.messages.load.timeout.pre} ${xhr.timeout} ${window.data.messages.load.timeout.post}`);
  });
  xhr.addEventListener(`load`, () => {
    let err;
    switch (xhr.status) {
      case 200:
        onSuccess(xhr.response);
        break;
      case 400:
        err = window.data.messages.load.err400;
        break;
      case 401:
        err = window.data.messages.load.err401;
        break;
      case 404:
        err = window.data.messages.load.err404;
        break;
      default:
        err = `${window.data.messages.load.status} ${xhr.status} ${xhr.statusText}`;
    }
    if (err) {
      onError(`${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.send();
};
window.load = load;
