"use strict";
import {
  getFromLocalStorage,
  getToken,
  getUrlParam,
  saveLocalStorage,
} from "./utils.js";

const baseUrl = "https://divarapi.liara.run";

const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const cities = await res.json();
  return cities;
};
const getAllLocations = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const response = await res.json();
  return response.data;
};
const getAndShowSocials = async () => {
  const socialMediaContainer = document.querySelector("#footer__social-media");
  const res = await fetch(`${baseUrl}/v1/social`);
  const socialsResponse = await res.json();
  socialsResponse.data.socials.forEach((social) => {
    socialMediaContainer.insertAdjacentHTML(
      "beforeend",
      `
        <a href="${social.link}" class="sidebar__icon-link">
            <img width="18px" height="18px" alt="${social.name}" src="${baseUrl}/${social.icon.path}" class="sidebar__icon bi bi-twitter"/>
        </a>
      `,
    );
  });
};

const getAndShowHeaderCityLocation = async () => {
  const headerCityTitle = document.querySelector("#header-city-title");
  const cities = getFromLocalStorage("cities");
  if (headerCityTitle) {
    if (!cities) {
      saveLocalStorage("cities", [{ title: "تهران", id: 301 }]);
      const cities = getFromLocalStorage("cities");
      headerCityTitle.textContent = cities[0].title;
    } else {
      if (cities.length === 1) {
        headerCityTitle.textContent = cities[0].title;
      } else {
        headerCityTitle.textContent = ` ${cities.length} شهر `;
      }
    }
  }
};
const getPosts = async (citiesIDs) => {
  const categotyID = getUrlParam("categoryID");
  const searchValue = getUrlParam("value");
  let url = await `${baseUrl}/v1/post/?city=${citiesIDs}`;
  if (categotyID) {
    url += `&categoryId=${categotyID}`;
  }
  if (searchValue) {
    url += `&search=${searchValue}`;
  }

  let res = await fetch(url);
  const posts = await res.json();
  return posts;
};
const getPostCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`);

  const response = await res.json();
  return response.data.categories;
};

//

const getPostDetails = async () => {
  const postID = getUrlParam("id");
  const token = getToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/v1/post/${postID}`, {
    headers,
  });
  const response = await res.json();
  return response.data.post;
};

export {
  baseUrl,
  getAllCities,
  getAndShowSocials,
  getPosts,
  getPostCategories,
  getAndShowHeaderCityLocation,
  getAllLocations,
  getPostDetails,
};
