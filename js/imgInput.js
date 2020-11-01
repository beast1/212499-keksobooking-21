"use strict";
// todo добавить возможность загружать несколько файлов при желании
(() => {
  const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
  const initImgInput = (inputSelector, previewSelector) => {
    const input = document.querySelector(inputSelector);
    const preview = document.querySelector(previewSelector);

    input.addEventListener(`change`, function () {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      const matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        const reader = new FileReader();

        reader.addEventListener(`load`, function () {
          preview.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });
  };
  window.imgInput = {
    init: initImgInput
  };
})();
