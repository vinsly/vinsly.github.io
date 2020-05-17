if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw_cached_site.js")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });
}
window.addEventListener("load", () => {
  let blogDataElement = document.querySelector("#blog_data");
  let form = document.querySelector("#data_submit");
  let blogArea = document.querySelector("#blogs");

  const createBlogPost = function (data) {
    let div = document.createElement("DIV");
    div.textContent = data;
    div.className = "blogPost";
    blogArea.appendChild(div);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchGif();
    createBlogPost(blogDataElement.value);
    blogDataElement.value = "";
  });

  function fetchGif() {
    const url =
      "image/pixel.gif?interaction=UserClick&client=media_net&os_name=win10&x1=google&x2=email&x3=pdfconvert&landing_url=github";
    fetch(url)
      .then((res) => res.blob())
      .then((res) => console.log(res))
      .catch((err) => console.log("Something went wrong:", err));
  }
  fetchGif();
});
