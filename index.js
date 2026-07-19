const { ipcRenderer, clipboard } = require('electron');
const fs = require('fs/promises');
const path = require('path');

const filePathsettings = path.join(__dirname, 'settings.json');

function control(action) {
    ipcRenderer.send('window-controls', action);
}

const app = document.querySelector("#app");

document.getElementById('width').addEventListener('click', () => {
  ipcRenderer.send('window-controls', 'toggle-size');
  app.classList.toggle('width');
  document.body.classList.toggle('width');
});

const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
}

const themeButton = document.querySelectorAll('.themesw');

function tht() {
  body.classList.toggle('dark');

  if (body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.removeItem('theme');
  }
}

themeButton.forEach(button => {
    button.addEventListener('click', tht);
});

document.addEventListener('DOMContentLoaded', () => {
    const maininp = document.querySelector('.maininp');
    const answer = document.querySelector('.answer');
    const buttons = document.querySelectorAll('.panel, .panelr');

    let currentInput = '';
    let expression = '';
    let shouldResetScreen = false;
    let isInv = false;
    let isRad = true;

    function updateDisplay() {
        maininp.value = currentInput === '' ? '0' : currentInput;
        answer.textContent = expression;
    }

    function updateButtonLabels() {
        const btns = document.querySelectorAll('.panelr');
        btns.forEach(b => {
            let txt = b.textContent.trim();
            if (txt === 'sin' || txt === 'asin') b.textContent = isInv ? 'asin' : 'sin';
            if (txt === 'cos' || txt === 'acos') b.textContent = isInv ? 'acos' : 'cos';
            if (txt === 'tan' || txt === 'atan') b.textContent = isInv ? 'atan' : 'tan';
            if (txt === 'RAD' || txt === 'DEG') b.textContent = isRad ? 'RAD' : 'DEG';
        });
    }

    function appendNumber(number) {
        if (expression === 'Error' || currentInput === 'Error') {
            expression = '';
            currentInput = '';
        }
        if (shouldResetScreen) {
            currentInput = '';
            shouldResetScreen = false;
        }
        if (currentInput === '0' && number !== ',') {
            currentInput = number;
        } else {
            if (number === ',' && currentInput.includes(',')) {
                return;
            }
            currentInput += number;
        }
        updateDisplay();
    }

    function chooseOperator(op) {
        if (expression === 'Error' || currentInput === 'Error') {
            expression = '';
            currentInput = '';
        }
        if (currentInput !== '') {
            if (expression !== '') {
                compute();
                expression = currentInput + ' ' + op;
                currentInput = '';
            } else {
                expression = currentInput + ' ' + op;
                currentInput = '';
            }
        } else {
            if (expression !== '') {
                const lastChar = expression.trim().slice(-1);
                if (['+', '-', '*', '/', '^'].includes(lastChar)) {
                    expression = expression.trim().slice(0, -1) + op;
                } else {
                    expression = expression.trim() + ' ' + op;
                }
            }
        }
        shouldResetScreen = true;
        updateDisplay();
    }

    function evaluateExpression(expr) {
        let sanitized = expr.replace(/,/g, '.');
        sanitized = sanitized.replace(/\^/g, '**');
        sanitized = sanitized.replace(/π/g, 'Math.PI');
        sanitized = sanitized.replace(/e/g, 'Math.E');
        
        if (/[^0-9\.\+\-\*\/\(\)\s\*]/.test(sanitized.replace(/Math\.PI/g, '').replace(/Math\.E/g, '').replace(/\*\*/g, ''))) {
            return 'Error';
        }
        
        try {
            let result = new Function('return ' + sanitized)();
            if (!isFinite(result) || isNaN(result)) return 'Error';
            return Math.round(result * 10000000000) / 10000000000;
        } catch (e) {
            return 'Error';
        }
    }

    function compute() {
        if (expression === 'Error' || currentInput === 'Error') {
            expression = '';
            currentInput = '';
            shouldResetScreen = true;
            updateDisplay();
            return;
        }
        
        let fullExpr = expression.trim();
        if (currentInput !== '') {
            fullExpr += ' ' + currentInput;
        }
        
        if (!fullExpr) return;

        let result = evaluateExpression(fullExpr);
        
        if (result === 'Error') {
            expression = 'Error';
            currentInput = '';
        } else {
            expression = '';
            currentInput = result.toString().replace('.', ',');
        }
        shouldResetScreen = true;
        updateDisplay();
    }

    function clearAll() {
        currentInput = '';
        expression = '';
        shouldResetScreen = false;
        updateDisplay();
    }

    function clearEntry() {
        currentInput = '';
        shouldResetScreen = false;
        updateDisplay();
    }

    function backspace() {
        if (currentInput === 'Error' || currentInput === '0') {
            currentInput = '';
        } else {
            currentInput = currentInput.toString().slice(0, -1);
        }
        shouldResetScreen = false;
        updateDisplay();
    }

    function toggleSign() {
        if (currentInput === '' || currentInput === '0' || currentInput === 'Error') {
            return;
        }
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }

    function factorial(n) {
        if (n < 0 || n % 1 !== 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }

    function applyUnary(op) {
        if (currentInput === '' || currentInput === 'Error') return;
        let val = parseFloat(currentInput.replace(',', '.'));
        let res = 0;

        if (op === 'sin' || op === 'asin') {
            if (op === 'sin') {
                let angle = isRad ? val : (val * Math.PI / 180);
                res = Math.sin(angle);
            } else {
                res = Math.asin(val);
                if (!isRad) res = res * 180 / Math.PI;
            }
        } else if (op === 'cos' || op === 'acos') {
            if (op === 'cos') {
                let angle = isRad ? val : (val * Math.PI / 180);
                res = Math.cos(angle);
            } else {
                res = Math.acos(val);
                if (!isRad) res = res * 180 / Math.PI;
            }
        } else if (op === 'tan' || op === 'atan') {
            if (op === 'tan') {
                let angle = isRad ? val : (val * Math.PI / 180);
                res = Math.tan(angle);
            } else {
                res = Math.atan(val);
                if (!isRad) res = res * 180 / Math.PI;
            }
        } else if (op === '√') {
            if (val < 0) {
                currentInput = 'Error';
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            res = Math.sqrt(val);
        } else if (op === 'x²') {
            res = val * val;
        } else if (op === 'x!') {
            if (val < 0 || val % 1 !== 0) {
                currentInput = 'Error';
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            res = factorial(val);
        }

        res = Math.round(res * 10000000000) / 10000000000;
        currentInput = res.toString().replace('.', ',');
        shouldResetScreen = true;
        updateDisplay();
    }

    function insertConstant(val) {
        if (shouldResetScreen) {
            currentInput = '';
            shouldResetScreen = false;
        }
        currentInput = val.toString().replace('.', ',');
        updateDisplay();
    }

    function insertParenthesis() {
        if (shouldResetScreen) {
            currentInput = '';
            shouldResetScreen = false;
        }
        let openCount = (currentInput.match(/\(/g) || []).length;
        let closeCount = (currentInput.match(/\)/g) || []).length;
        
        if (currentInput === '' || currentInput.match(/[\+\-\*\/\^]$/)) {
            currentInput += '(';
        } else if (openCount > closeCount) {
            currentInput += ')';
        } else {
            currentInput += '(';
        }
        updateDisplay();
    }

    answer.addEventListener('click', () => {
        const ansText = answer.textContent.trim();
        if (!ansText || ansText === 'Error') {
            return;
        }
        currentInput = ansText;
        expression = '';
        shouldResetScreen = true;
        updateDisplay();
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.textContent.trim();

            if (text >= '0' && text <= '9') {
                appendNumber(text);
            } else if (text === ',') {
                appendNumber(',');
            } else if (text === '+' || text === '-' || text === '*' || text === '/') {
                chooseOperator(text);
            } else if (text === 'xʸ') {
                chooseOperator('^');
            } else if (text === '=') {
                compute();
            } else if (text === 'C') {
                clearAll();
            } else if (text === 'CE') {
                clearEntry();
            } else if (text === 'B') {
                backspace();
            } else if (text === '+/-') {
                toggleSign();
            } else if (text === 'INV') {
                isInv = !isInv;
                updateButtonLabels();
            } else if (text === 'RAD' || text === 'DEG') {
                isRad = !isRad;
                updateButtonLabels();
            } else if (text === 'x!') {
                applyUnary('x!');
            } else if (text === 'sin' || text === 'asin') {
                applyUnary(isInv ? 'asin' : 'sin');
            } else if (text === 'cos' || text === 'acos') {
                applyUnary(isInv ? 'acos' : 'cos');
            } else if (text === 'tan' || text === 'atan') {
                applyUnary(isInv ? 'atan' : 'tan');
            } else if (text === 'π') {
                insertConstant(Math.PI);
            } else if (text === 'e') {
                insertConstant(Math.E);
            } else if (text === '√') {
                applyUnary('√');
            } else if (text === '()') {
                insertParenthesis();
            } else if (text === 'x²') {
                applyUnary('x²');
            }
        });
    });

    updateDisplay();
});