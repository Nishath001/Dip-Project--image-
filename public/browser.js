const btn = document.getElementById("btn");
const form = document.getElementById("form");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");

fileInput.addEventListener("change", (e) => {
  const file=e.target.files[0]
  console.log(file)
  const filename=URL.createObjectURL(file)
  console.log(filename)
  output.setAttribute('src',filename)
});
btn.addEventListener("click", (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  console.log(file);
  if (file) {
    const formData = new FormData();
    formData.append("imageInput", file);

    fetch("/upload", {
      method: "POST",

      body: formData,
    })
      .then((data) =>
        data.json().then((data) => {
          output.setAttribute("src", data.data),
            download.setAttribute("href", data.data);
        })
      )
      .catch((err) => console.log("error is", err));
  }
});
