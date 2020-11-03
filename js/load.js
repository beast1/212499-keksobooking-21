'use strict';

const load = (url, onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.timeout = 10000;

  xhr.addEventListener(`error`, () => {
    onError(window.data.messages.load.common);
  });
  xhr.addEventListener(`timeout`, () => {
    onError(`${window.data.messages.load.timeout.pre} ${xhr.timeout} ${window.data.messages.load.timeout.post}`);
  });
  xhr.addEventListener(`load`, () => {
    let err;
    switch (xhr.status) {
      case window.data.statusDictionary.success:
        onSuccess(xhr.response);
        break;
      case window.data.statusDictionary.badRequest:
        err = window.data.messages.load.err400;
        break;
      case window.data.statusDictionary.missingAuth:
        err = window.data.messages.load.err401;
        break;
      case window.data.statusDictionary.notFound:
        err = window.data.messages.load.err404;
        break;
      default:
        err = `${window.data.messages.load.status} ${xhr.status} ${xhr.statusText}`;
    }
    if (err) {
      onError(`${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.open(`GET`, url);
  xhr.send();
};
window.load = load;
