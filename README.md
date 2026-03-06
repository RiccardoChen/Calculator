# 🧮 Advanced Web Calculator

A modern, feature-rich calculator built with vanilla HTML, CSS, and JavaScript. Designed with a sleek glassmorphism UI, full keyboard support, and advanced mathematical operations including natural logarithms, factorials, square roots, and powers.

---

## ✨ Features

### Core Operations
- Addition, subtraction, multiplication, division
- Decimal point input with duplication prevention
- Operator replacement (no double operators)
- Full clear (`AC`), clear entry (`CE`), and backspace (`⌫`)

### Advanced Math
| Operation | Button | Keyboard |
|-----------|--------|----------|
| Natural log `ln(x)` | `ln` | `l` |
| Factorial `x!` | `x!` | `!` |
| Percentage `x%` | `%` | `%` |
| Reciprocal `1/x` | `¹/x` | `i` |
| Power `xʸ` | `xʸ` | `^` |
| Square root `√x` | `²√x` | `r` |
| Open/close parentheses | `( )` | `( )` |

### Nested Expressions
The calculator resolves complex nested expressions before evaluating:
- `ln(ln(5!))` → resolves inner `ln(120)` first, then outer
- `√(ln(5))` → resolves `ln(5)` first, then applies `√`
- `(3+4)^2` → elevates the entire parenthesized expression
- `1/(3+4)` → takes the reciprocal of the full group

### History Panel
- Displays every completed calculation with its original expression and result
- Click any history entry to reload the result into the display
- Trash icon appears automatically when history is non-empty and clears all entries on click

---

## 🗂️ Project Structure

```
calculator/
├── index.html      
├── styles.css    
└── app.js      
```

---

## 🚀 Getting Started

No build tools or dependencies required. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/your-username/calculator.git
cd calculator
open index.html
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0–9` | Input digits |
| `+` `-` `*` `/` | Operators (`*` → `×`, `/` → `÷`) |
| `.` | Decimal point |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last character |
| `Delete` | Clear last entry |
| `Escape` or `c` | Full clear |
| `l` | Insert `ln(` |
| `!` | Factorial |
| `%` | Percentage |
| `^` | Power (`xʸ`) |
| `r` | Square root (`√`) |
| `i` | Reciprocal (`1/x`) |
| `(` `)` | Parentheses |

---

## 🧠 Expression Resolution

The `execute()` function processes expressions in layers before calling `eval()`:

1. **Nested `ln` / `√`** — resolved recursively from the innermost group outward using a `do...while` loop with the regex `/ln\(([^()]*)\)/g` and `/√\(([^()]*)\)/g`
2. **Factorial and percentage** — tokens containing `!` or `%` are pre-calculated and substituted back into the expression
3. **Operator substitution** — `×` → `*`, `÷` → `/`, `^` → `**` before final `eval()`
4. **Safety checks** — `isFinite` and `isNaN` guards; any unhandled case displays `Errore`

---

## 📐 Responsive Layout

| Breakpoint | Layout |
|------------|--------|
| `> 768px` | Calculator and history side by side |
| `≤ 768px` | Stacked vertically, history below calculator |
| `≤ 480px` | Compact padding, reduced font sizes, optimized button tap targets |

---

## 🎨 Design

- **Glassmorphism** card style with `backdrop-filter: blur` and semi-transparent borders
- Dark background gradient (`#1f1f1f` → `#000000`)
- Accent color `#e87c17` (orange) for the equals button and history hover states
- Monospace font (`Courier New`) on the display for consistent digit width
- Smooth `0.2s` transitions on all interactive elements

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
