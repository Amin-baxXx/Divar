import { baseUrl } from "./shared.js";
import { hideModal, showSwal } from "./utils.js";
const step1LoginFormError = document.querySelector(".step-1-login-form__error");
const step2LoginFormError = document.querySelector(".step-2-login-form__error");
const phoneNumberInput = document.querySelector(".login-modal__input");
const loginModal = document.querySelector(".login-modal");
const userNumberNotice = document.querySelector(".user_number_notice");
const requestTimerContainer = document.querySelector(".request_timer span");
const requestTimer = document.querySelector(".request_timer");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const loading = document.querySelector("#loading-container");
const otpInput = document.querySelector(".code_input");
let phoneNumber;
const submitNumber = async () => {
  loading.classList.add("active-login-loader");
  const phoneRegex = /^(?:\+?(?:98|۹۸)|0|۰)?[9۹][0-9۰-۹]{9}$/;
  phoneNumber = phoneNumberInput.value;
  const isValidPhoneNumber = phoneRegex.test(phoneNumber);
  if (isValidPhoneNumber) {
    step1LoginFormError.textContent = "";
    const res = await fetch(`${baseUrl}/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    if (res.status === 200) {
      loading.classList.remove("active-login-loader");

      loginModal.classList.add("active_step_2");
      userNumberNotice.textContent = phoneNumber;
      reqNewCodeBtn.style.display = "none";
    }

    let count = 30;
    requestTimerContainer.style.display = "flex";
    requestTimerContainer.textContent = "30";
    let time = setInterval(() => {
      count--;
      requestTimerContainer.textContent = `${count}`;
      if (count === 0) {
        clearInterval(time);
        reqNewCodeBtn.style.display = "block";
        requestTimer.style.display = "none";
      }
    }, 100);
  } else {
    loading.classList.remove("active-login-loader");
    step1LoginFormError.textContent = "شماره تماس معتبر نیست!";
  }
};
const verifyOtp = async () => {
  loading.classList.add("active-login-loader");
  const otpRegex = RegExp(/^\d{4}$/);
  const userOtp = otpInput.value;
  const isValidOtp = otpRegex.test(userOtp);
  if (isValidOtp) {
    step2LoginFormError.textContent = "😶";
    const res = await fetch(`${baseUrl}/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber, otp: userOtp }),
    });
    if (res.status === 200 || res.status === 201) {
      loading.classList.remove("active-login-loader");
      hideModal("login-modal", "login-modal--active");
      showSwal(
        "با موفقیت وارد شدید😉",
        "success",
        "وارد شوید!",
        () => (location.href = "../pages/userPanel/verify.html"),
      );
    } else if (res.status === 400) {
      loading.classList.remove("active-login-loader");
      otpInput.value = "";
      step2LoginFormError.textContent = "کد وارد شده نامعتبر هست😶‍🌫️";
    }
    console.log(res);
    // location.href = "/login";
  } else {
    loading.classList.remove("active-login-loader");
    step2LoginFormError.textContent = "کد وارد شده نامعتبر هست😶‍🌫️";
    return console.log("HELLO WORLD");
  }
};
export { submitNumber, verifyOtp };
