import { getMe, isLogin } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const isUserLogin = await isLogin();
  const sideBarPhoneNumber = document.querySelector("#sidebar-phone-number");
  console.log(sideBarPhoneNumber);
  if (isUserLogin) {
    getMe().then((user) => {
      sideBarPhoneNumber.textContent = `تلفن: ${user.phone} `;
    });
  } else {
    location.href = "../../../pages/posts.html";
  }
});
