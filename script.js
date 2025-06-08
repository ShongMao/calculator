const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.button');

display.textContent = '0';
let inputString = '0';
let previousAnswer = '0';

buttons.forEach(button => {
  button.addEventListener('click', () => handleButtonClick(button.textContent));
});

function handleButtonClick(value) {
  if (!isNaN(value) || value === '.') {
    handleNumber(value);
  } else if (value === 'DEL') {
    del();
  } else if (value === 'AC') {
    inputString = '0';
    previousAnswer = '0';
  } else if (value === '=') {
    calculate(inputString);
  } else if (value === 'ANS') {
    usePrevious();
  } else {
    handleOperator(value);
  }
  // console.log(inputString);
  // console.log(`ans equals: ${previousAnswer}`);
  updateDisplay();
  if (value === '=') {
    inputString = '0';
  }
  return;
}

function del() {
  if (inputString === '0' || inputString == '') {
    // inputString = previousAnswer;
    return;
  } 
  inputString = inputString.slice(0, -1);
  if (inputString === '') inputString = '0';

  return
}

function handleNumber(value) {
  if (inputString === '0') {
    inputString = '';
  }
  inputString += value;
  return;
}

function handleOperator(value) {
  if (inputString === '0') {
    inputString = previousAnswer;
  }
  inputString += value;
  return;
}

function updateDisplay() {
  display.textContent = inputString;
  return;
}

function usePrevious() {
  if (inputString === '0') {
    inputString = previousAnswer; 
  } else {
    inputString += previousAnswer;
  }
  return;
}


function calculate(input) {
  const expr = input.replace(/\s+/g, '');
  
  // Tokenize the expression
  const tokens = expr.match(/([0-9.]+)|([+\-x÷])/g) || [];
  
  const outputQueue = [];
  const operatorStack = [];
  
  const precedence = {
      '+': 1,
      '-': 1,
      'x': 2,
      '÷': 2
  };
  
  for (const token of tokens) {
      if (!isNaN(token)) {
          outputQueue.push(parseFloat(token));
      } else {
          while (operatorStack.length > 0 && 
                  precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
              outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
      }
  }
  
  while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop());
  }
  
  // Evaluate the postfix expression
  const evalStack = [];
  
  for (const token of outputQueue) {
      if (typeof token === 'number') {
          evalStack.push(token);
      } else {
          const b = evalStack.pop();
          const a = evalStack.pop();
          
          switch (token) {
              case '+': evalStack.push(a + b); break;
              case '-': evalStack.push(a - b); break;
              case 'x': evalStack.push(a * b); break;
              case '÷': 
                  if (b === 0) throw new Error('Division by zero');
                  evalStack.push(a / b); 
                  break;
          }
      }
  }
    
  inputString = evalStack[0];
  previousAnswer = inputString;
  return;
}

function isDigit(digit) {
  if (digit === '.' || !isNaN(digit)) {
    return true;
  } 
  return false;
}