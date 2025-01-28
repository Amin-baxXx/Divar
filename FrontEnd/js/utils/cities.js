"use strict";
const fetchAllities = async () => {
  const allCities = await fetch("http://localhost:4000/api/cities/");
  const resCity = await allCities.json();
  return resCity;
};

const fetchPopularCities = async () => {
  const response = await fetch("http://localhost:4000/api/cities/popular");
  const data = await response.json();
  return await data;
};
const setCityCookie = (city) => {
  document.cookie = `city=${city}; path=/`;
};
const getCookies = (doc) => {
  const referrer = document.referrer;
  const CityInCookie = doc.split("; ").find((cookie) => {
    return cookie.includes("city=");
  });
  if (CityInCookie && !referrer) {
    window.location.href = `http://localhost:63342/Project%20DiVar/FrontEnd/pages/main.html?${CityInCookie}`;
  } else return null;

  return CityInCookie;
};
export { fetchPopularCities, setCityCookie, getCookies, fetchAllities };
