// Add the appropriate classes to .input elements
// for styling purposes
const inputs = document.querySelectorAll(".input");
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    // clear .used styling by default
    input.classList.remove("used");

    // apply used styling if necessary
    let conditions = [input.value.length > 0];

    if (input.type === "checkbox") conditions = [input.checked];

    if (conditions.reduce((sum, check) => sum && check, true)) {
      input.classList.add("used");
    }
  });
});

this.addEventListener("library-changed", () => {
  inputs.forEach((input) => {
    input.classList.remove("used");
  });
});

const checkBoxes = document.querySelectorAll(".toggle[type='checkbox']");
checkBoxes.forEach((checkBox) => {
  const p = checkBox.parentElement;

  const toggle = document.createElement("div");
  toggle.classList.add("toggle-display");
  p.appendChild(toggle);
});
