let token = localStorage.getItem("authToken");
let currentUserId = localStorage.getItem("currentUser");

// Change API link to use correct URL depending on whether the app is running locally or on deployed service
// local - http://localhost:3001/... 
// deployed - https://full-stack-tech-blog.onrender.com/... 
// the below fetches the base url of the site you are currently on, so will replace all the fetch(urls) with this using template literals
const baseURL = window.location.origin;

// create a function that fetches all the categories and places each in an option tag for the 2 dropdown lists
function loadCategories(){
  const postCat = document.getElementById("post-category");
  const filterCat = document.getElementById("filter-category");

  fetch(`${baseURL}/api/categories`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((categories) => {
      postCat.innerHTML = "";
      filterCat.innerHTML = `<option value="">All</option>`; // include option to select all categories, i.e. no filter
      categories.forEach((category) => {
        const postOption = document.createElement("option");
        postOption.value = category.id;
        postOption.textContent = category.category_name;
        postCat.appendChild(postOption);

        const filteroption = document.createElement("option");
        filteroption.value = category.id;
        filteroption.textContent = category.category_name;
        filterCat.appendChild(filteroption);
      });
    });
}

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch(`${baseURL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch(`${baseURL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

        // store logged in userId
        localStorage.setItem("currentUser", data.userData.id);
        currentUserId = data.userData.id;        

        alert("User Logged In successfully");
        
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";

        // load categories for dropdown once logged in
        loadCategories();

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch(`${baseURL}/api/users/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    localStorage.removeItem("currentUser");
    currentUserId = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}


function fetchPosts() {
  const filterId = Number(document.getElementById("filter-category").value);
  
    if(filterId === 0){
      fetch(`${baseURL}/api/posts`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((posts) => {
          const postsContainer = document.getElementById("posts");
          postsContainer.innerHTML = "";
          posts.forEach((post) => {
            let buttonsHTML = "";
            if (post.userId === currentUserId) {
            // add additional arguments to onclick updatePost functions as they are needed for the update route. 
            // Use single quotes so that the double quotes from the JSON string are not affected
            buttonsHTML = 
            `<div id="post-buttons">
                <button onclick="deletePost(${post.id})">Delete</button>
                <button onclick='updatePost(${post.id}, ${JSON.stringify(post.title)}, ${JSON.stringify(post.content)}, ${JSON.stringify(post.postedBy)}, ${post.categoryId})'>Update</button>
              </div>`;
            }
            const div = document.createElement("div");
            div.innerHTML = 
            `<h3>${post.title}</h3>
            <p>${post.content}</p>
            <p>Category: ${post.category.category_name}</p>
            <small>By: ${post.postedBy} on ${new Date(post.createdOn).toLocaleString()}</small>
            ${buttonsHTML}`;
            postsContainer.appendChild(div);
          });
        });
    }
    // update the fetch posts url to include category filter  
    else{
      fetch(`${baseURL}/api/posts/${filterId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((posts) => {
          const postsContainer = document.getElementById("posts");
          postsContainer.innerHTML = "";
          posts.forEach((post) => {
            let buttonsHTML = "";
            if (post.userId === currentUserId) {
              buttonsHTML = 
              `<div id="post-buttons">
                  <button onclick="deletePost(${post.id})">Delete</button>
                  <button onclick='updatePost(${post.id}, ${JSON.stringify(post.title)}, ${JSON.stringify(post.content)}, ${JSON.stringify(post.postedBy)}, ${post.categoryId})'>Update</button>
                </div>`;
            }
            const div = document.createElement("div");
            div.innerHTML = 
            `<h3>${post.title}</h3>
            <p>${post.content}</p>
            <p>Category: ${post.category.category_name}</p>
            <small>By: ${post.postedBy} on ${new Date(post.createdOn).toLocaleString()}</small>
            ${buttonsHTML}`;
            postsContainer.appendChild(div);
          });
        });
    }
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const category = Number(document.getElementById("post-category").value);
  const author = document.getElementById("post-author").value;

  if(!title || !content || !category || !author){
    alert("Please complete all fields to submit post");
    return
  }
  
  fetch(`${baseURL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy: author, categoryId: category}),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      fetchPosts();
      document.getElementById("post-title").value = "";
      document.getElementById("post-content").value = "";
      document.getElementById("post-author").value = "";
    });
}

function deletePost(postId) {
  fetch(`${baseURL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: {Authorization: `Bearer ${token}`},
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post deleted successfully");
      fetchPosts();
    });
}


function updatePost(postId, postTitle, postContent, postAuthor, postCategoryId) {
  const updateTitle = prompt("Edit title:", postTitle);
  const updateContent = prompt("Edit content:", postContent);

  if(!updateTitle || !updateContent){
    alert("Please don't leave fields blank");
    return
  }
  
  fetch(`${baseURL}/api/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: updateTitle, content: updateContent, postedBy: postAuthor, categoryId: postCategoryId}),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post updated successfully");
      fetchPosts();
    });
}