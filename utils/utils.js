const saveLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
export { getFromLocalStorage, saveLocalStorage };
