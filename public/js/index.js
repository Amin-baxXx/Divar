"use strict";
import { getAllCities } from "../../utils/shared.js";

window.addEventListener("load", async () => {
  const loadingContainer = document.querySelector("#loading-container");
  getAllCities().then((response) => {
    loadingContainer.style.display = "none";
    const popularCitiesContainer = document.querySelector("#popular-cities");
    const popularCities = response.data.cities.filter((city) => city.popular);
    popularCities.forEach((city) => {
      popularCitiesContainer.insertAdjacentHTML(
        "beforeend",
        `
        <li class="main__cities-item">
            <p class="main__cities-link">${city.name}</p>
        </li>
      `
      );
    });
  });
  //   Get All City For Input Search And Add Searching Feature
  const searchInput = document.querySelector("#search-input");
  const searchResultCities = document.querySelector(".search-result-cities");
  let response = await getAllCities();
  let AllCitiesName = response.data.cities.map((city) => city.name);

  searchInput.addEventListener("input", (e) => {
    let filteredCity = AllCitiesName.filter((city) => {
      return city.startsWith(searchInput.value);
    });
    console.log(filteredCity);
    if (filteredCity.length) {
      console.log(filteredCity);
      searchResultCities.classList.add("active");
      searchResultCities.innerHTML = "";
      filteredCity.forEach((city) => {
        searchResultCities.insertAdjacentHTML(
          "beforeend",
          `
          <li>${city}</li>
        `
        );
      });
      console.log(filteredCity);
    } else {
      searchResultCities.innerHTML = "";
      searchResultCities.classList.add("active");
      searchResultCities.insertAdjacentHTML(
        "beforeend",
        `
        <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" />
        <p class="empty">نتیجه‌ای برای جستجوی شما پیدا نشد.</p>
      `
      );
    }
    if (!searchInput.value) {
      searchResultCities.classList.remove("active");
    }
  });
});
