// Selecting All Element
const number = document.querySelectorAll(".number");
const operators = document.querySelectorAll(
  ".operators:not(#erase):not(#backspace)"
);
const equal = document.querySelector("#equal");
const backspace = document.querySelector("#backspace");
const clear = document.querySelector("#erase");
const sqrtBtn = document.querySelector("#sqrt");
const percentBtn = document.querySelector("#percent");
const realTimeInput = document.querySelector("#realTimeInput");
const result = document.querySelector("#result");

// Number and operators click handlings with eventListener
let currentInput = "";
let currentResult = 0;

number.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentInput += btn.textContent;
    realTimeInput.textContent = currentInput;
  });
});

operators.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentInput += ` ${btn.textContent} `;
    realTimeInput.textContent = currentInput;
  });
});

// Handle Equal
equal.addEventListener("click", () => {
  try {
    // Replace symbol with JS operators
    let expression = currentInput.replace(/÷/g, "/").replace(/×/g, "*");

    currentResult = eval(expression); // Eval works but be cautions
    result.textContent = currentResult;
  } catch {
    result.textContent = "Error";
  }
});
