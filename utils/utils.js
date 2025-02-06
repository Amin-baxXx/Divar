const saveLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
import { baseUrl } from "./shared.js";

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
const getUrlParam = (param) => {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get(param);
};
const addParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;
  searchParams.set(param, value);
  url.search = searchParams.toString();
  location.href = url.toString();
};
const removeParamFromUrl = (param) => {
  const url = new URL(location.href);
  url.searchParams.delete(param);
  window.history.replaceState(null, null, url);
  location.reload();
};
const calcuteRelativeTimeDifference = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);
  const timeDiff = currentTime - createdTime;
  const hours = Math.floor(timeDiff / 3600000);
  if (hours < 24) {
    return `${hours} ساعت `;
  } else {
    const days = Math.floor(hours / 24);
    return `  ${days} روز پیش `;
  }
};
const showModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.add(className);
};
const hideModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.remove(className);
};
const getToken = () => {
  const token = getFromLocalStorage("token");
  return token;
};

const isLogin = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.status === 200 ? true : false;
};

const getMe = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data.user;
};

const showSwal = (title, icon, buttons, callback) => {
  swal({
    title: title,
    icon: icon,
    buttons: buttons,
  }).then((result) => callback(result));
};
const paginateItems = (
  href,
  paginationContainer,
  currentPage,
  totalItems,
  itemPerPage,
) => {
  paginationContainer ? (paginationContainer.innerHTML = "") : "";
  let paginatedCount = Math.ceil(totalItems / itemPerPage);

  for (let i = 1; i < paginatedCount + 1; i++) {
    paginationContainer?.insertAdjacentHTML(
      "beforeend",
      `
        <li class="${i === Number(currentPage) ? "active" : ""}">
          <a href="${href}?page=${i}">${i}</a>
        </li>
      `,
    );
  }
};

export {
  saveLocalStorage,
  getFromLocalStorage,
  addParamToUrl,
  getUrlParam,
  calcuteRelativeTimeDifference,
  removeParamFromUrl,
  showModal,
  hideModal,
  isLogin,
  showSwal,
  getToken,
  getMe,
  paginateItems,
};
