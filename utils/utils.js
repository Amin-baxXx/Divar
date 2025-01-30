const saveLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
const addParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;
  searchParams.set(param, value);
  url.search = searchParams.toString();
  location.href = url.toString();
};
const calculateRelativeTimeDefference = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);
  const timeDiff = currentTime - createdTime;
  const hours = Math.floor(timeDiff / (60 * 60 * 1000));
  if (hours < 24) {
    return `${hours} ساعت `;
  } else {
    const days = Math.floor(hours / 24);
    return `  ${days} روز پیش `;
  }
};
export {
  getFromLocalStorage,
  saveLocalStorage,
  addParamToUrl,
  calculateRelativeTimeDefference,
};
