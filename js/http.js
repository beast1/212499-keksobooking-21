'use strict';

(() => {
  const http = (requestType, url, onSuccess, onError, data) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    let method;

    if (requestType === `load`) {
      method = `GET`;
      xhr.timeout = 10000;

      xhr.addEventListener(`error`, () => {
        onError(window.data.messages.load.common);
      });
      xhr.addEventListener(`timeout`, () => {
        onError(`${window.data.messages.load.timeout.pre} ${xhr.timeout} ${window.data.messages.load.timeout.post}`);
      });
    } else if (requestType === `upload`) {
      method = `POST`;
    }

    xhr.addEventListener(`load`, () => {
      let err;
      switch (xhr.status) {
        case window.data.statusDictionary.success:
          if (requestType === `load`) {
            onSuccess(xhr.response);
          } else if (requestType === `upload`) {
            onSuccess(window.data.messages.upload.success);
          }
          break;
        case window.data.statusDictionary.badRequest:
          err = window.data.messages.upload.err400;
          break;
        case window.data.statusDictionary.missingAuth:
          err = window.data.messages.upload.err401;
          break;
        case window.data.statusDictionary.notFound:
          err = window.data.messages.upload.err404;
          break;
        default:
          err = `${window.data.messages.upload.status} ${xhr.status} ${xhr.statusText}`;
      }
      if (err) {
        onError(`${xhr.status} ${xhr.statusText}`);
      }
    });

    xhr.open(method, url);
    xhr.send(data);
  };
  window.http = http;
})();
