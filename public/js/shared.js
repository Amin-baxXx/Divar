"use strict";

import {
  getAndShowSocials,
  getAndShowHeaderCityLocation,
} from "../../utils/shared.js";
import { showModal, hideModal } from "../../utils/utils.js";

window.addEventListener("load", () => {
  getAndShowSocials();
  getAndShowHeaderCityLocation();
  const globalSearchInput = document.getElementById("global_search_input");
  const searchbarModalOverlay = document.querySelector(
    ".searchbar__modal-overlay",
  );
  const header__form = document.querySelector(".header__form");
  header__form?.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  globalSearchInput?.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value.trim()) {
        location.href = `posts.html?value=${e.target.value.trim()}`;
      }
    }
  });
  globalSearchInput?.addEventListener("click", (e) => {
    showModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active",
    );
  });
  globalSearchInput.addEventListener("blur", (e) => {
    hideModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active",
    );
  });
});
