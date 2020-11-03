'use strict';

const UPLOAD_URL = ` https://21.javascript.pages.academy/keksobooking`;
const upload = (data, onSuccess) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    let err;
    switch (xhr.status) {
      case window.data.statusDictionary.success:
        onSuccess(window.data.messages.upload.success);
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
      window.util.showUserMessage(`error`, `${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.open(`POST`, UPLOAD_URL);
  xhr.send(data);
};
window.upload = upload;
