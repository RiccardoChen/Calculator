const display = document.querySelector(".display");
const buttonsContainer = document.querySelector(".buttons");

const operators = ["+", "-", "×", "÷"];
const keyOperators = ["+", "-", "*", "/"];
const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const allKeys = [...keyOperators, ...nums];

// ─── Helpers ────────────────────────────────────────────────────────────────

const lastChar = () => display.value.slice(-1);
const endsWith = (s) => display.value.endsWith(s);
const isOperator = (c) => operators.includes(c);

// ─── Input numerico ──────────────────────────────────────────────────────────

function firstPrint(num) {
  const val = display.value;

  if (val === "0") {
    display.value = num;
  } else if (val.endsWith("ln(0)")) {
    display.value = val.slice(0, -2) + num + ")";
  } else if (val.endsWith("ln()")) {
    display.value = val.slice(0, -1) + num + ")";
  } else if (val.endsWith(")")) {
    display.value += "×" + num;
  } else {
    display.value += num;
  }
}

// ─── Operatori ───────────────────────────────────────────────────────────────

function singleOperator(ope) {
  const last = lastChar();
  const penultimate = display.value.slice(-2, -1);

  if (last === "." && isOperator(penultimate)) {
    display.value = display.value.slice(0, -2) + ope;
  } else if (isOperator(last) || last === ".") {
    display.value = display.value.slice(0, -1) + ope;
  } else {
    display.value += ope;
  }
}

// ─── Punto decimale ──────────────────────────────────────────────────────────

function pointController(point) {
  const parts = display.value.split(/[+\-×÷]/);
  if (!parts.at(-1).includes(".")) display.value += point;
}

// ─── Cancellazione ───────────────────────────────────────────────────────────

const clearEntry = () => {
  display.value = display.value.replace(/[0-9.!%]+$/, "") || "0";
};

const rollBack = () => {
  display.value = display.value.slice(0, -1) || "0";
};

const fullClear = () => {
  display.value = "0";
};

// ─── Fattoriale e percentuale ─────────────────────────────────────────────────

function recursive(num) {
  return num <= 0 ? 1 : num * recursive(num - 1);
}

function factorial(esclam) {
  const parts = display.value.split(/[+\-×÷]/);
  const last = parts.at(-1);
  if (last && !last.includes(esclam)) display.value += esclam;
}

function percentage(p) {
  const parts = display.value.split(/[+\-×÷]/);
  if (parts.at(-1)) display.value += p;
}

function percentCalc(v) {
  const count = [...v].filter((c) => c === "%").length;
  const num = [...v].filter((c) => c !== "%").join("");
  return num * 0.01 ** count;
}

// ─── Logaritmo naturale ───────────────────────────────────────────────────────

function showIn() {
  if (isOperator(lastChar())) return;

  if (display.value === "0") {
    display.value = "ln(0)";
    return;
  }

  const match = display.value.match(/([^+\-×÷]+)$/);
  if (match) {
    const rest = display.value.slice(0, -match[0].length);
    display.value = rest + "ln(" + match[0] + ")";
  }
}

// ─── Parentesi tonde ───────────────────────────────────────────────────────────────

function parOpen(p) {
  if (display.value === "0") {
    display.value = p;
    return;
  }
  const lastChar = display.value.slice(-1);

  if (/\d/.test(lastChar) || lastChar === ")" || lastChar === "!") {
    display.value += "×" + p;
  } else {
    display.value += p;
  }
}

function parClose(p) {
  const lastChar = display.value.slice(-1);

  const opPar = [...display.value].filter((v) => v === "(").length;
  const clPar = [...display.value].filter((v) => v === ")").length;

  if (opPar > clPar) {
    if (!operators.includes(lastChar) && lastChar !== "(" && lastChar !== ".") {
      display.value += p;
    }
  }
}

// ─── Esecuzione ───────────────────────────────────────────────────────────────

function execute() {
  try {
    let expr = display.value;

    // ─── Risolve ricorsivamente ln annidati ──────────────────────────────────
    function resolveLn(expression) {
      // Caso base: nessun ln presente, ritorna l'espressione
      if (!expression.includes("ln(")) return expression;

      return expression.replace(/ln\(([^()]*)\)/g, (_, inner) => {
        let innerVal = inner;

        // Calcola fattoriale dentro ln
        if (innerVal.includes("!")) {
          if (!Number.isInteger(+innerVal.slice(0, -1))) throw new Error();
          innerVal = recursive(innerVal.slice(0, -1));
        }

        // Calcola percentuale dentro ln
        if (String(innerVal).includes("%")) {
          innerVal = percentCalc(String(innerVal));
        }

        // Valuta l'espressione numerica dentro le parentesi
        const innerResult = eval(
          String(innerVal).replaceAll("×", "*").replaceAll("÷", "/"),
        );

        return Math.log(innerResult);
      });
    }

    // Continua a risolvere finché ci sono ln annidati
    let prev;
    do {
      prev = expr;
      expr = resolveLn(expr);
    } while (expr !== prev && String(expr).includes("ln("));

    // ─── Pre-processa ! e % fuori da ln ──────────────────────────────────────
    if (String(expr).includes("!") || String(expr).includes("%")) {
      const op = [...display.value].filter(isOperator);

      const parts = display.value
        .split(/[+\-×÷]/)
        .filter((v) => !v.startsWith("ln"))
        .map((v) => {
          if (v.includes("!") && v.includes("%")) {
            const perCount = [...v].filter((c) => c === "%").length;
            const base = v.slice(0, -perCount - 1);
            if (v.indexOf("!") < v.indexOf("%") && Number.isInteger(+base)) {
              return percentCalc(recursive(base) + "%".repeat(perCount));
            }
          }
          if (v.includes("!")) {
            if (!Number.isInteger(+v.slice(0, -1))) throw new Error();
            return recursive(v.slice(0, -1));
          }
          if (v.includes("%")) return percentCalc(v);
          throw new Error();
        });

      expr = parts.reduce(
        (acc, val, i) => acc + (i > 0 ? op[i - 1] : "") + val,
        "",
      );
    }

    // ─── Valutazione finale ───────────────────────────────────────────────────
    const result = eval(String(expr).replaceAll("×", "*").replaceAll("÷", "/"));

    display.value = isFinite(result) && !isNaN(result) ? result : "Errore";
  } catch {
    display.value = "Errore";
  }
}

// ─── Event delegation (click) ─────────────────────────────────────────────────

buttonsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;

  const { number, action, operator, point, operation } = e.target.dataset;

  if (number !== undefined) firstPrint(number);
  else if (isOperator(operator)) singleOperator(operator);
  else if (point === ".") pointController(point);
  else if (operation === "!") factorial(operation);
  else if (operation === "%") percentage(operation);
  else if (operation === "ln") showIn();
  else if (operation === "(") parOpen(operation);
  else if (operation === ")") parClose(operation);
  else if (action === "CE") clearEntry();
  else if (action === "rollback") rollBack();
  else if (action === "clear") fullClear();
  else if (action === "equals") execute();
});

// ─── Keyboard support ────────────────────────────────────────────────────────

const keyMap = {
  Enter: execute,
  "=": execute,
  Backspace: rollBack,
  Delete: clearEntry,
  Escape: fullClear,
  c: fullClear,
  ".": () => pointController("."),
  "!": () => factorial("!"),
  "%": () => percentage("%"),
  l: showIn,
  "*": () => singleOperator("×"),
  "/": () => singleOperator("÷"),
};

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!allKeys.includes(key) && !keyMap[key]) return;

  if (nums.includes(key)) return firstPrint(key);
  if (keyOperators.slice(0, 2).includes(key)) return singleOperator(key); // + e -
  if (keyMap[key]) keyMap[key]();
});
