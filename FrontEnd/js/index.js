"use strict";
import {
  fetchPopularCities,
  getCookies,
  setCityCookie,
  fetchAllities,
} from "./utils/cities.js";

const $ = document;
// Click City
const puplarCitiesParent = $.querySelector("#cities-container");
const cityClickHandler = (event, city) => {
  event.preventDefault();
  setCityCookie(city);
  window.location.href = `http://localhost:63342/Project%20DiVar/FrontEnd/pages/main.html?city=${city}`;
};
// City Func
const showPopularCities = (cities) => {
  cities.forEach((city) => {
    let cityItem = $.createElement("div");
    cityItem.classList.add("col-2", "d-flex", "justify-content-center");
    cityItem.insertAdjacentHTML(
      "beforeend",
      `
     <li class="main__cities-item">
         <a class="main__cities-link" href="#" >${city.name} </a>
    </li>
      `,
    );
    const mainCitiesLink = cityItem.querySelector(".main__cities-link");
    mainCitiesLink.addEventListener("click", (e) =>
      cityClickHandler(e, city.href),
    );
    puplarCitiesParent.appendChild(cityItem);
  });
};
// City INput
const citySearchResult = async () => {
  // Selecting Tags
  const mainInput = document.querySelector(".main__input");
  const searchResultCities = $.querySelector(".search-result-cities");
  // All City
  const allCity = await fetchAllities();

  mainInput.addEventListener("focus", () => {
    searchResultCities.classList.add("active");
  });
  mainInput.addEventListener("input", () => {
    if (mainInput.value) {
      searchResultCities.classList.add("active");
      const cityFiltered = allCity.filter((city) => {
        return city.name.startsWith(mainInput.value);
      });
      searchResultCities.innerHTML = "";
      cityFiltered.forEach((city) => {
        searchResultCities.insertAdjacentHTML(
          "beforeend",
          `
          <li>${city.name}</li>
          `,
        );
      });
    } else {
      searchResultCities.classList.remove("active");
    }
  });

  mainInput.addEventListener("blur", () => {
    searchResultCities.classList.remove("active");
  });
};
window.addEventListener("load", async function () {
  const puplarCities = await fetchPopularCities();
  showPopularCities(puplarCities);
  // Start Cookie Redirect
  getCookies(document.cookie);
  // End Cookie Redirect
  // Search City
  await citySearchResult();
});
