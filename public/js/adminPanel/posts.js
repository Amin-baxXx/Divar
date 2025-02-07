import { baseUrl } from "../../../utils/shared.js";
import { getToken, getUrlParam } from "./../../../utils/utils.js";

window.addEventListener("load", async () => {
  const token = getToken();

  let page = getUrlParam("page");
  !page ? (page = 1) : null;

  const postsGenerator = async () => {
    // Codes
    const postsTable = document.querySelector("#posts-table");
    const paginationItems = document.querySelector(".pagination-items");
    const emptyContainer = document.querySelector(".empty");

    const res = await fetch(`${baseUrl}/v1/post/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();
    const posts = response.data.posts;

    console.log("Posts ->", posts);

    if (posts.length) {
      postsTable.insertAdjacentHTML(
        `beforeend`,
        `
            <tr>
                <th>عنوان</th>
                <th>کاربر</th>
                <th>وضعیت</th>
                <th>تایید</th>
                <th>رد</th>
                <th>حذف</th>
            </tr>
            ${posts
              .map(
                (post) => `
                <tr>
                    <td>${post.title}</td>
                    <td>${post.creator.phone}</td>
                    <td>
                        ${
                          post.status === "published"
                            ? `<p class="publish">منتشر شده</p>`
                            : ""
                        }
                        ${
                          post.status === "rejected"
                            ? `<p class="reject">رد شده</p>`
                            : ""
                        }
                        ${
                          post.status === "pending"
                            ? `<p class="pending">در صف انتشار</p>`
                            : ""
                        }
                    </td>
                    <td>
                        ${
                          post.status === "published" ||
                          post.status === "rejected"
                            ? "❌"
                            : `<button onclick="acceptPost('${post._id}')">تایید</button>`
                        }
                    </td>
                    <td>
                        ${
                          post.status === "published" ||
                          post.status === "rejected"
                            ? "❌"
                            : `<button onclick="rejectPost('${post._id}')">رد</button>`
                        }
                    </td>
                    <td>
                        <button onclick="deletePost('${post._id}')">حذف</button>
                    </td>
                </tr>
            `,
              )
              .join("")}
        `,
      );
    } else {
      emptyContainer.style.display = "flex";
    }
  };

  await postsGenerator();

  window.deletePost = (postID) => {
    // Codes
  };

  window.acceptPost = (postID) => {
    // Codes
  };

  window.rejectPost = (postID) => {
    // Codes
  };
});
