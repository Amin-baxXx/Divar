"use strict";

import {
  getAndShowSocials,
  getAndShowHeaderCityLocation,
  getAllLocations,
  getPostCategories,
  showPanelLinks,
} from "../../utils/shared.js";
import {
  showModal,
  hideModal,
  getFromLocalStorage,
  saveLocalStorage,
  addParamToUrl,
  removeParamFromUrl,
  isLogin,
} from "../../utils/utils.js";
import { submitNumber, reqNewOtp, verifyOtp } from "../../utils/auth.js";
window.addEventListener("load", async () => {
  let selectedCities = [];
  let allCities = [];
  const isUserLogin = await isLogin();
  getAndShowSocials();
  showPanelLinks();
  getAndShowHeaderCityLocation();

  const globalSearchInput = document.getElementById("global_search_input");
  const createPostBtn = document.querySelector(".create_post_btn");
  const headerCity = document.querySelector(".header__city");
  const deleteAllSelectionCity = document.querySelector("#delete-all-cities");
  const header__form = document.querySelector(".header__form");
  const citiesModalList = document.querySelector("#city_modal_list");
  const cityModalAcceptBtns = document.querySelector(".city-modal__accept");
  const cityModalCloseBtns = document.querySelector(".city-modal__close");
  const cityModalError = document.querySelector("#city_modal_error");
  const cityModalOverley = document.querySelector(".city-modal__overlay");
  const categoriesList = document.querySelector("#categories-list");
  const categoryResults = document.querySelector("#category-results");
  const cityModalCitiesInput = document.querySelector(
    "#city-modal-search-input",
  );
  const submitPhoneNumberBtn = document.querySelector(
    ".submit_phone_number_btn",
  );
  const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
  const loginBtn = document.querySelector(".login_btn");
  const headerCategoryBtn = document.querySelector(".header__category-btn");
  const allCategoriesPosts = document.querySelector("#all-categories-posts");
  const loginModalOverlay = document.querySelector(".login_modal_overlay");
  const loginModalCloseIcon = document.querySelector(".login-modal__icon");
  const categoryModalOverlay = document.querySelector(
    ".category_modal_overlay",
  );
  categoryModalOverlay?.addEventListener("click", () => {
    hideModal("header__category-menu", "header__category-menu--active");
  });
  allCategoriesPosts?.addEventListener("click", () => {
    removeParamFromUrl("categoryID");
  });
  getPostCategories().then((categories) => {
    categories.forEach((category) => {
      categoriesList?.insertAdjacentHTML(
        "beforeend",
        `
          <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${category._id}')">
            <div class="header__category-menu-link">
              <div class="header__category-menu-link-right">
                <i class="header__category-menu-icon bi bi-house"></i>
                ${category.title}
              </div>
              <div class="header__category-menu-link-left">
                <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
              </div>
            </div>
          </li>
        `,
      );
    });

    window.showActiveCategorySubs = (categoryID) => {
      const category = categories.find(
        (category) => category._id === categoryID,
      );

      categoryResults ? (categoryResults.innerHTML = "") : null;

      category.subCategories.map((subCategory) => {
        categoryResults?.insertAdjacentHTML(
          "beforeend",
          `
            <div>
              <ul class="header__category-dropdown-list">
                <div class="header__category-dropdown-title" onclick="categoryClickHandler('${subCategory._id}')">${
                  subCategory.title
                }</div>
                ${subCategory.subCategories
                  .map(
                    (subSubCategory) => `
                    <li class="header__category-dropdown-item">
                      <div onclick="categoryClickHandler('${subSubCategory._id}')" class="header__category-dropdown-link">${subSubCategory.title}</div>
                    </li>
                  `,
                  )
                  .join("")}
              </ul>
            </div>
          `,
        );
      });
    };
    showActiveCategorySubs(categories[0]._id);
    window.categoryClickHandler = (categoryID) => {
      addParamToUrl("categoryID", categoryID);
    };
  });
  submitPhoneNumberBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    submitNumber();
  });
  loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    verifyOtp();
  });
  reqNewCodeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    reqNewOtp();
  });
  headerCategoryBtn?.addEventListener("click", () => {
    console.log("clicked");
    showModal("header__category-menu", "header__category-menu--active");
  });
  header__form?.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  const addCityToModal = (cities) => {
    const citySelected = document.querySelector("#city-selected");

    citySelected.innerHTML = "";

    cities.forEach((city) => {
      citySelected.insertAdjacentHTML(
        "beforeend",
        `
          <div class="city-modal__selected-item">
            <span class="city-modal__selected-text">${city.title}</span>
            <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
              <i class="city-modal__selected-icon bi bi-x"></i>
            </button>
          </div>
        `,
      );
    });
  };
  window.removeCityFromModal = (cityID) => {
    const currentCity = document.querySelector(`#city-${cityID}`);
    if (currentCity) {
      const checkbox = currentCity.querySelector("input");
      const checkboxShape = currentCity.querySelector("div");
      checkbox.checked = false;
      checkboxShape.classList.remove("active");
    }
    selectedCities = selectedCities.filter((city) => city.id !== cityID);
    addCityToModal(selectedCities);
    toggelCityModalBtns(selectedCities);
  };
  getAllLocations().then((data) => {
    allCities = data;
    showProvinces(allCities);
  });
  const showProvinces = (data) => {
    citiesModalList ? (citiesModalList.innerHTML = "") : null;
    cityModalCitiesInput?.scrollTo(0, 0);
    data.provinces?.forEach((province) => {
      citiesModalList?.insertAdjacentHTML(
        "beforeend",
        `
          <li
            class="city-modal__cities-item province-item"
            data-province-id="${province.id}"
          >
            <span>${province.name}</span>
            <i class="city-modal__cities-icon bi bi-chevron-left"></i>
          </li>
        `,
      );
    });

    const provinceItems = document.querySelectorAll(".province-item");

    provinceItems.forEach((province) => {
      province.addEventListener("click", (event) => {
        const provinceID = event.target.dataset.provinceId;
        const provinceName = event.target.querySelector("span").innerHTML;

        citiesModalList.innerHTML = "";

        citiesModalList.insertAdjacentHTML(
          "beforeend",
          `
            <li id="city_modal_all_province" class="city_modal_all_province">
              <span>همه شهر ها</span>
              <i class="bi bi-arrow-right-short"></i>
            </li>
            <li class="city-modal__cities-item select-all-city city-item">
              <span>همه شهر های ${provinceName} </span>
              <div id="checkboxShape"></div>
              <input type="checkbox" />
            </li>
          `,
        );

        const provinceCities = data.cities.filter(
          (city) => city.province_id === Number(provinceID),
        );

        provinceCities.forEach((city) => {
          const isSelect = selectedCities.some(
            (selectedCity) => selectedCity.title === city.name,
          );

          citiesModalList.insertAdjacentHTML(
            "beforeend",
            `
              <li class="city-modal__cities-item city-item" id="city-${
                city.id
              }">
                <span>${city.name}</span>
                <div id="checkboxShape" class="${isSelect && "active"}"></div>
                <input onchange="cityItemClickHandler('${
                  city.id
                }')" id="city-item-checkbox" type="checkbox" checked="${isSelect}" />
              </li>
            `,
          );
        });

        const cityModalAllProvinces = document.querySelector(
          "#city_modal_all_province",
        );

        cityModalAllProvinces.addEventListener("click", () => {
          citiesModalList.innerHTML = "";
          showProvinces(data);
        });
      });
    });
  };
  window.cityItemClickHandler = (cityID) => {
    const cityElement = document.querySelector(`#city-${cityID}`);
    const checkbox = cityElement.querySelector("input");
    const cityTitle = cityElement.querySelector("span").innerHTML;
    const checkboxShape = cityElement.querySelector("div");

    selectedCities.forEach((city) => {
      if (city.title === cityTitle) {
        checkbox.checked = true;
        checkboxShape.classList.add("active");
      }
    });

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
      updateSelectedCities(cityTitle, cityID);
      checkboxShape.classList.add("active");
    } else {
      selectedCities = selectedCities.filter(
        (city) => city.title !== cityTitle,
      );

      checkbox.checked = true;
      checkboxShape.classList.remove("active");
      addCityToModal(selectedCities);
      toggelCityModalBtns(selectedCities);
    }
  };
  const toggelCityModalBtns = (cities) => {
    if (cities.length) {
      cityModalAcceptBtns.classList.replace(
        "city-modal__accept",
        "city-modal__accept--active",
      );
      deleteAllSelectionCity.style.display = "block";
      cityModalError.style.display = "none";
    } else {
      cityModalAcceptBtns.classList.replace(
        "city-modal__accept--active",
        "city-modal__accept",
      );
      deleteAllSelectionCity.style.display = "none";
      cityModalError.style.display = "block";
    }
  };
  const updateSelectedCities = (cityTitle, cityID) => {
    const isTitleRepeated = selectedCities.some(
      (city) => city.title === cityTitle,
    );

    if (!isTitleRepeated) {
      selectedCities.push({ title: cityTitle, id: cityID });
      toggelCityModalBtns(selectedCities);
      addCityToModal(selectedCities);
    }
  };
  headerCity?.addEventListener("click", (e) => {
    showModal("city-modal", "city-modal--active");
    const cities = getFromLocalStorage("cities");
    selectedCities = cities;
    deleteAllSelectionCity.style.display = "block";
    addCityToModal(selectedCities);
  });
  deleteAllSelectionCity?.addEventListener("click", (e) => {
    deSelectAllCitiesfromModal();
    selectedCities = [];
    addCityToModal(selectedCities);
    cityModalAcceptBtns.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept",
    );
    cityModalError.style.display = "block";
    deleteAllSelectionCity.style.display = "none";
  });
  const deSelectAllCitiesfromModal = () => {
    const cityElemnts = document.querySelectorAll(".city-item");
    cityElemnts.forEach((city) => {
      const checkBox = city.querySelector("input");
      const checkBoxShape = city.querySelector("div");
      checkBox.checked = false;
      checkBoxShape.classList.remove("active");
    });
  };
  globalSearchInput?.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value.trim()) {
        location.href = `posts.html?value=${e.target.value.trim()}`;
      }
    }
  });
  globalSearchInput?.addEventListener("click", (e) => {
    console.log("HEllo");
    showModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active",
    );
  });
  globalSearchInput?.addEventListener("blur", (e) => {
    hideModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active",
    );
  });
  cityModalAcceptBtns?.addEventListener("click", () => {
    saveLocalStorage("cities", selectedCities);
    const citiesIDs = selectedCities.map((city) => city.id).join("|");
    addParamToUrl("cities", citiesIDs);
    getAndShowHeaderCityLocation();
    hideModal("city-modal", "city-modal--active");
    showProvinces(allCities);
  });
  cityModalCloseBtns?.addEventListener("click", () => {
    hideModal("city-modal", "city-modal--active");

    cityModalAcceptBtns.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept",
    );

    showProvinces(allCities);
  });
  cityModalOverley?.addEventListener("click", () => {
    hideModal("city-modal", "city-modal--active");
    cityModalAcceptBtns.classList.replace(
      "city-modal__accept--active",
      "city-modal__accept",
    );
    showProvinces(allCities);
  });
  cityModalCitiesInput?.addEventListener("input", (e) => {
    console.log(e.value);
    const filteredCities = allCities.cities.filter((city) => {
      return city.name.startsWith(e.target.value);
    });
    if (filteredCities.length && e.target.value.trim()) {
      citiesModalList.innerHTML = "";
      filteredCities.forEach((city) => {
        const isSelect = selectedCities.some(
          (selectedCity) => selectedCity.title === city.name,
        );
        citiesModalList.insertAdjacentHTML(
          "beforeend",
          `
    <li class="city-modal__cities-item city-item" id="city-${city.id}">
                <span>${city.name}</span>
                <div id="checkboxShape" class="${isSelect && "active"}"></div>
                <input onchange="cityItemClickHandler('${city.id}')" id="city-item-checkbox" type="checkbox" checked="${isSelect}">
              </li>
        
        `,
        );
      });
    } else {
      citiesModalList.innerHTML = "";
      showProvinces(allCities);
    }
  });
  loginModalOverlay?.addEventListener("click", () => {
    hideModal("login-modal", "login-modal--active");
  });
  loginModalCloseIcon?.addEventListener("click", () => {
    hideModal("login-modal", "login-modal--active");
  });
  createPostBtn?.addEventListener("click", () => {
    if (isUserLogin) {
      location.href = "../../pages/new.html";
    } else {
      showModal("login-modal", "login-modal--active");
      hideModal("header__category-menu", "header__category-menu--active");
    }
  });
});
