import { baseUrl, getPostDetails } from "../../utils/shared.js";
import {
  calcuteRelativeTimeDifference,
  isLogin,
  showModal,
  showSwal,
  getToken,
  getUrlParam,
} from "../../utils/utils.js";

window.addEventListener("load", () => {
  getPostDetails().then(async (post) => {
    console.log(post);
    const landing = document.querySelector("#loading-container");
    landing.style.display = "none";
    const userIsLogin = await isLogin();
    const token = await getToken();
    let noteID = null;
    let bookmarkStatus = null;
    const postTitle = document.querySelector("#post-title");
    const postDescription = document.querySelector("#post-description");
    const postLocation = document.querySelector("#post-location");
    const postBreadCrumb = document.querySelector("#breadcrumb");
    const shareIcon = document.querySelector("#share-icon");
    const postInfos = document.querySelector("#post-infoes-list");
    const postPreview = document.querySelector("#post-preview");
    const mainSlider = document.querySelector("#main-slider-wrapper");
    const secondSlider = document.querySelector("#secend-slider-wrapper");
    const noteTextarea = document.querySelector("#note-textarea");
    const postFeedbackIcons = document.querySelectorAll(".post_feedback_icon");
    const phoneInfoBtn = document.querySelector("#phone-info-btn");
    const noteTrashIcon = document.querySelector("#note-trash-icon");
    const bookMarkIconBtn = document.querySelector("#bookmark-icon-btn");
    const bookMarkIcon = document.querySelector(".post__btn-icon");
    postTitle.textContent = post.title;
    postDescription.textContent = post.description;
    const date = calcuteRelativeTimeDifference(post.createdAt);
    postLocation.textContent = ` ${date}پیش در ${post.city.name}, ${post.neighborhood.name ? post.neighborhood.name : ""}  `;
    postBreadCrumb.insertAdjacentHTML(
      "beforeend",
      `
     <li class="main__breadcrumb-item">
          <a href='/pages/posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">${post.title}</li>    
      `,
    );
    shareIcon.addEventListener("click", async () => {
      await navigator.share(location.href);
    });
    postInfos.insertAdjacentHTML(
      "beforeend",
      `
        <li class="post__info-item">
          <span class="post__info-key">قیمت</span>
          <span class="post__info-value">${post.price.toLocaleString()} تومان</span>
        </li>
      `,
    );

    if (userIsLogin) {
      // Bookmard
      if (post.bookmarked) {
        bookMarkIcon.style.color = "red";
        bookmarkStatus = true;
      } else {
        bookmarkStatus = false;
      }

      bookMarkIconBtn.addEventListener("click", async () => {
        const postID = getUrlParam("id");

        if (bookmarkStatus) {
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            bookmarkStatus = false;
            bookMarkIcon.style.color = "gray";
          }
        } else {
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 201) {
            bookmarkStatus = true;
            bookMarkIcon.style.color = "red";
          }
        }
      });

      // Note
      if (post.note) {
        noteTextarea.value = post.note.content;
        noteTrashIcon.style.display = "block";
        noteID = post.note._id;
      }
      noteTextarea.addEventListener("keyup", (event) => {
        if (event.target.value.trim()) {
          noteTrashIcon.style.display = "block";
        } else {
          noteTrashIcon.style.display = "none";
        }
      });

      noteTextarea.addEventListener("blur", async (event) => {
        if (noteID) {
          await fetch(`${baseUrl}/v1/note/${noteID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              content: event.target.value,
            }),
          });
        } else {
          await fetch(`${baseUrl}/v1/note`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postId: post._id,
              content: event.target.value,
            }),
          });
        }
      });

      noteTrashIcon.addEventListener("click", () => {
        noteTextarea.value = "";
        noteTrashIcon.style.display = "none";
      });
    } else {
      noteTextarea.addEventListener("focus", (event) => {
        event.preventDefault();
        showModal("login-modal", "login-modal--active");
      });
    }
  });
});
