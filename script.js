let current = '';      // number being typed
let previous = '';     // first operand
let operator = null;   // pending operator

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

/* ---------- Calculator operation functions ---------- */
function add(a, b)      { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) return 'Cannot divide by 0';
  return a / b;
}
function modulus(a, b)  { return a % b; }

/* ---------- UI helpers ---------- */
function updateDisplay() {
  resultEl.textContent = current !== '' ? current : (previous !== '' ? previous : '0');
  expressionEl.textContent = operator ? `${previous} ${operator}` : '';
}

function appendNumber(num) {
  if (num === '.' && current.includes('.')) return;
  if (num === '.' && current === '') current = '0';
  if (current === '0' && num !== '.') current = '';
  current += num;
  updateDisplay();
}

function chooseOperator(op) {
  if (current === '' && previous === '') return;
  if (current === '' && previous !== '') {   // change operator
    operator = op;
    updateDisplay();
    return;
  }
  if (previous !== '') calculate(true);      // chain operations
  operator = op;
  previous = current !== '' ? current : previous;
  current = '';
  updateDisplay();
}

function calculate(chained = false) {
  if (operator === null || current === '' || previous === '') return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let answer;

  switch (operator) {
    case '+': answer = add(a, b); break;
    case '-': answer = subtract(a, b); break;
    case '×': answer = multiply(a, b); break;
    case '÷': answer = divide(a, b); break;
    case '%': answer = modulus(a, b); break;
  }

  if (typeof answer === 'string') {          // error message
    clearAll();
    resultEl.textContent = answer;
    return;
  }

  answer = Math.round(answer * 1e10) / 1e10; // avoid 0.1+0.2 issues
  if (!chained) expressionEl.textContent = `${previous} ${operator} ${current} =`;

  current = chained ? '' : String(answer);
  previous = chained ? String(answer) : '';
  operator = null;
  if (!chained) resultEl.textContent = answer;
  else updateDisplay();
}

function clearAll() {
  current = '';
  previous = '';
  operator = null;
  updateDisplay();
}

function backspace() {
  current = current.slice(0, -1);
  updateDisplay();
}

/* ---------- Keyboard support (extra credit) ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendNumber('.');
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('-');
  else if (e.key === '*') chooseOperator('×');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('÷'); }
  else if (e.key === '%') chooseOperator('%');
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clearAll();
});