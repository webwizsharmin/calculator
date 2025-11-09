// Elements
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(
  ".operators:not(#erase):not(#backspace)"
);
const equal = document.querySelector("#equal");
const backspace = document.querySelector("#backspace");
const clear = document.querySelector("#erase");
const sqrtBtn = document.querySelector("#sqrt");
const percentBtn = document.querySelector("#percent");
const realTimeInput = document.querySelector("#realTimeInput");
const resultDisplay = document.querySelector("#result");

// State
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;
let waitingForNewCalculation = false;

// Math functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? "Math Error!" : a / b);
const sqrt = (a) => (a < 0 ? "Math Error!" : Math.sqrt(a));
const percent = (a) => a / 100;

// Operate
function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "×":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    default:
      return null;
  }
}

// Update display with smart font resizing
function updateDisplay(value) {
  if (typeof value === "number") value = Math.round(value * 100000) / 100000;
  if (isNaN(value) || value === Infinity || value === -Infinity)
    value = "Math Error!";
  value = value.toString();

  if (value.length > 12) resultDisplay.style.fontSize = "1.2rem";
  else if (value.length > 8) resultDisplay.style.fontSize = "1.8rem";
  else resultDisplay.style.fontSize = "2.5rem";

  resultDisplay.textContent = value;
}

// Number buttons
numbers.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (waitingForNewCalculation) {
      resultDisplay.textContent = "0";
      realTimeInput.textContent = "";
      firstNumber = null;
      secondNumber = null;
      currentOperator = null;
      waitingForNewCalculation = false;
    }

    if (shouldResetDisplay) {
      resultDisplay.textContent = "0";
      shouldResetDisplay = false;
    }

    if (btn.textContent === "." && resultDisplay.textContent.includes("."))
      return;
    if (resultDisplay.textContent.replace(".", "").length >= 12) return;

    if (
      resultDisplay.textContent === "0" ||
      resultDisplay.textContent === "Math Error!"
    ) {
      resultDisplay.textContent = btn.textContent;
    } else {
      resultDisplay.textContent += btn.textContent;
    }

    realTimeInput.textContent += btn.textContent;
    updateDisplay(resultDisplay.textContent);
  });
});

// Operator buttons
operators.forEach((btn) => {
  btn.addEventListener("click", () => {
    const operator = btn.textContent;
    if (resultDisplay.textContent === "Math Error!") return;

    if (currentOperator && !shouldResetDisplay) {
      secondNumber = resultDisplay.textContent;
      let computation = operate(currentOperator, firstNumber, secondNumber);
      updateDisplay(computation);
      firstNumber = computation;
    } else {
      firstNumber = parseFloat(resultDisplay.textContent);
    }

    if (/[+\-×÷]$/.test(realTimeInput.textContent)) {
      realTimeInput.textContent =
        realTimeInput.textContent.slice(0, -1) + operator;
    } else {
      realTimeInput.textContent += operator;
    }

    currentOperator = operator;
    shouldResetDisplay = true;
  });
});

// Square root
sqrtBtn.addEventListener("click", () => {
  let current = parseFloat(resultDisplay.textContent);
  let result = sqrt(current);
  updateDisplay(result);
  realTimeInput.textContent = `√(${current})`;
  shouldResetDisplay = true;
  waitingForNewCalculation = true;
});

// Percent
percentBtn.addEventListener("click", () => {
  let current = parseFloat(resultDisplay.textContent);
  let result = percent(current);
  updateDisplay(result);
  realTimeInput.textContent = `${current}%`;
  shouldResetDisplay = true;
  waitingForNewCalculation = true;
});

// Equal button
equal.addEventListener("click", () => {
  if (!currentOperator || waitingForNewCalculation) return;

  secondNumber = resultDisplay.textContent;
  let computation = operate(currentOperator, firstNumber, secondNumber);
  updateDisplay(computation);

  if (computation === "Math Error!") {
    realTimeInput.textContent = "Math Error!";
  } else {
    realTimeInput.textContent = `${firstNumber}${currentOperator}${secondNumber}=${computation}`;
  }

  firstNumber = computation;
  currentOperator = null;
  shouldResetDisplay = true;
  waitingForNewCalculation = true;
});

// Clear all
clear.addEventListener("click", () => {
  resultDisplay.textContent = "0";
  realTimeInput.textContent = "";
  firstNumber = null;
  secondNumber = null;
  currentOperator = null;
  shouldResetDisplay = false;
  waitingForNewCalculation = false;
  resultDisplay.style.fontSize = "2.5rem";
});

// Backspace
backspace.addEventListener("click", () => {
  if (waitingForNewCalculation || resultDisplay.textContent === "Math Error!")
    return;

  resultDisplay.textContent = resultDisplay.textContent.slice(0, -1) || "0";
  realTimeInput.textContent = realTimeInput.textContent.slice(0, -1) || "";
  updateDisplay(resultDisplay.textContent);
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key >= "0" && key <= "9") {
    numbers.forEach((btn) => {
      if (btn.textContent === key) btn.click();
    });
  } else if (key === ".") {
    numbers.forEach((btn) => {
      if (btn.textContent === ".") btn.click();
    });
  } else if (["+", "-", "*", "/"].includes(key)) {
    const op = key === "*" ? "×" : key === "/" ? "÷" : key;
    operators.forEach((btn) => {
      if (btn.textContent === op) btn.click();
    });
  } else if (key === "Enter" || key === "=") {
    equal.click();
  } else if (key === "Backspace") {
    backspace.click();
  } else if (key.toLowerCase() === "c") {
    clear.click();
  }
});
