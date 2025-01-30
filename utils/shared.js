"use strict";
const baseUrl = "https://divarapi.liara.run";

const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const cities = await res.json();
  return cities;
};

const getAndShowSocials = async () => {
  const socialMediaContainer = document.querySelector("#footer__social-media");
  const res = await fetch(`${baseUrl}/v1/social`);
  const socialsResponse = await res.json();
  socialsResponse.data.socials.forEach((social) => {
    console.log(social.icon.path);
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
const getPosts = async (citiesID) => {
  const url = await fetch(`${baseUrl}/v1/post/?city=${citiesID}`);
  const postes = await url.json();
  return postes;
};
const getCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`);
  const response = await res.json();
  return response.data.categories;
};
export { baseUrl, getAllCities, getAndShowSocials, getPosts, getCategories };
