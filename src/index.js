function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "<h3>Posts</h3>";
      posts.forEach(post => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.classList.add("post-title");
        div.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(div);
      });

      if (posts.length > 0) handlePostClick(posts[0].id);
    });
}

function handlePostClick(id) {
  fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));
      document.getElementById("delete-btn").addEventListener("click", () => deletePost(post.id));
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(newPost => {
        form.reset();
        appendPostToDOM(newPost); // 👈 this adds only the new post to the list
      });
  });
}


function showEditForm(post) {
  const form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");
  form["edit-title"].value = post.title;
  form["edit-content"].value = post.content;

  form.onsubmit = e => {
    e.preventDefault();
    const updatedPost = {
      title: form["edit-title"].value,
      content: form["edit-content"].value
    };

    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        handlePostClick(post.id);
      });
  };

  document.getElementById("cancel-edit").addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

function deletePost(id) {
  fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" })
    .then(() => {
      displayPosts();
      document.getElementById("post-detail").innerHTML = "<h3>Post Details</h3>";
    });
}

document.addEventListener("DOMContentLoaded", main);
function appendPostToDOM(post) {
  const postList = document.getElementById("post-list");

  const div = document.createElement("div");
  div.textContent = post.title;
  div.classList.add("post-title");

  div.addEventListener("click", () => handlePostClick(post.id));

  postList.appendChild(div);

  // Optionally show the new post's details immediately:
  handlePostClick(post.id);
}