const display = document.querySelector(".display");
const buttonsContainer = document.querySelector(".buttons");

const operators = ["+", "-", "×", "÷"];
const keyOperators = ["+", "-", "*", "/"];
const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const allKeys = [...keyOperators, ...nums];

/* Controlla se il valore di partenza è 0.
Se si viene sostituito con un altro numero.
Altrimenti concatena con altri numeri */
function firstPrint(num) {
  if (display.value === "0") display.value = num;
  else display.value += num;
}

/* Controlla se l'operatore non sia duplicata, 
o se c'è il punto sostituiscilo */
function singleOperator(ope) {
  const lastChar = display.value.slice(-1);
  const penultimate = display.value.slice(-2, -1);

  if (lastChar === "." && operators.includes(penultimate)) {
    display.value = display.value.slice(0, -2) + ope;
  } else if (operators.includes(lastChar) || lastChar === ".") {
    display.value = display.value.slice(0, -1) + ope;
  } else {
    display.value += ope;
  }
}

/* Controllo sulla duplicazione/ripetizione del punto */
function pointController(point) {
  const dividOper = display.value.split(/[\+\-\×\÷]/);
  const ultimoNum = dividOper[dividOper.length - 1];
  if (!ultimoNum.includes(".")) display.value += point;
}

/* CE che rimuove l'ultima cifra inserita */
function clearEntry() {
  display.value = display.value.replace(/[0-9.]+$/, "");
  if (display.value === "") display.value = "0";
}
/* Cancella l'ultima cifra od operazione inserita */
function rollBack() {
  display.value = display.value.slice(0, -1);
  if (display.value === "") display.value = "0";
}

/* Cancellazione completa risettando tutto a 0 */
function fullClear() {
  display.value = "0";
}

/* Esecuzione operazione */
function execute() {
  try {
    const replaced = display.value.replaceAll("×", "*").replaceAll("÷", "/");
    display.value = eval(replaced);
    if (!isFinite(display.value) || isNaN(display.value))
      display.value = "Errore";
  } catch (e) {
    display.value = "Errore";
  }
}

buttonsContainer.addEventListener("click", (e) => {
  const button = e.target;

  if (!button.matches("button")) return;

  /* event delegations */
  const number = button.dataset.number;
  const action = button.dataset.action;
  const operator = button.dataset.operator;
  const point = button.dataset.point;

  if (number !== undefined) {
    firstPrint(number);
  } else if (operators.includes(operator)) {
    singleOperator(operator);
  } else if (point === ".") {
    pointController(point);
  } else if (action === "CE") {
    clearEntry();
  } else if (action === "rollback") {
    rollBack();
  } else if (action === "clear") {
    fullClear();
  } else if (action === "equals") {
    execute();
  }
});

document.addEventListener("keydown", (e) => {
  const keyPressed = e.key;

  if (
    !allKeys.includes(keyPressed) &&
    !["Enter", "Backspace", "Delete", "Escape", ".", "=", "c"].includes(
      keyPressed,
    )
  )
    return;

  if (nums.includes(keyPressed)) {
    firstPrint(keyPressed);
  } else if (keyPressed === ".") {
    pointController(keyPressed);
  } else if (keyOperators.includes(keyPressed)) {
    if (keyPressed === "*") {
      singleOperator("×");
    } else if (keyPressed === "/") {
      singleOperator("÷");
    } else {
      singleOperator(keyPressed);
    }
  } else if (keyPressed === "Enter" || keyPressed === "=") {
    execute();
  } else if (keyPressed === "Backspace") {
    rollBack();
  } else if (keyPressed === "Delete") {
    clearEntry();
  } else if (keyPressed === "Escape" || keyPressed.toLowerCase() === "c") {
    fullClear();
  }
});

/*TODO: Adding buttons :
  1. x^y   x elevato alla y
  2. % percentuale
  3. x! fattoriale
  4. () parrentesi
  5. radice x 
  6. 1/x
  7. log base 10

  7. cronologia che viene stampato il calcolo quando clicchi su "="
*/
