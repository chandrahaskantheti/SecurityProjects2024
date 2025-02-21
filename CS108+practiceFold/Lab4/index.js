import React from 'react';
import ReactDOM from 'react-dom';

let lastOp = null;
let lastNum = null;
let calculationComp = false;
let lastResult = null;
let secondOperandWait = false;

function addDisplayVal(value) {
  const display = document.getElementById("calcdisplay");
  const operators = ["+", "-", "*", "/"];

  if(calculationComp && !operators.includes(value)) {
    display.value = value;
    calculationComp = false;
    lastOp = null;
    lastNum = null;
    lastResult = null;
    secondOperandWait = false;
    removeOpHighlight();
    return;
  }

  const latestChar = display.value.slice(-1);

  if (operators.includes(value)) {
    if (calculationComp) {
      lastOp = value;
      secondOperandWait = true;
      highlightOp(value);
      if (operators.includes(latestChar)) {
        display.value = display.value.slice(0, -1) + value;
      }
      else {
        display.value += value;
      }
      calculationComp = false;
      return;
    }

    if (!secondOperandWait && lastOp !== null) {
      calculateFinal();
    }
    lastOp = value;
    secondOperandWait = true;
    highlightOp(value);
    
    if (operators.includes(latestChar)) {
      display.value = display.value.slice(0, -1) + value;
    }
    else {
      display.value += value;
    }
  }
  else {
    display.value += value;
    secondOperandWait = false; 
  }
  calculationComp = false;
}

function clearDisplay() {
  const display = document.getElementById("calcdisplay");
  display.value = "";
  lastOp = null;
  lastNum = null;
  lastResult = null;
  calculationComp = false;
  secondOperandWait = false;
  removeOpHighlight();
}

function calculateFinal() {
  const display = document.getElementById("calcdisplay");
  const operators = ["+", "-", "*", "/"];
  // We use lastResult, lastOp, and lastNum in event that equal pressed repeatedly. 
  try {
    if (calculationComp && lastOp !== null && lastNum !== null) {
      const expression = `${lastResult} ${lastOp} ${lastNum}`;
      const result = eval(expression);
      display.value = result;
      lastResult = result;
    }
    else {
      const expression = display.value;
      const result = eval(expression);
      display.value = result;

      let operatorIndex = -1;  // We are going to store last op and 
      let currentOperator = null;  // second operand as well. 
      for (let op of operators) {  // This helps will searching for last instance of any operator. 
        const idx = expression.lastIndexOf(op);
        if (idx > operatorIndex) {
          operatorIndex = idx;
          currentOperator = op;
        }
      }
      if (currentOperator !== null && operatorIndex !== -1) {
        lastOp = currentOperator;
        const secondOperandStr = expression.substring(operatorIndex + 1);
        lastNum = parseFloat(secondOperandStr);
      }
      lastResult = result;
    }

    calculationComp = true;
    secondOperandWait = false;
    removeOpHighlight();
  }
  catch (error) {
    display.value = "Error";
  }
}

function highlightOp(selectedOperator) {
  removeOpHighlight();
  const operatorButton = document.querySelector(`[onclick="addDisplayVal('${selectedOperator}')"]`);
  if (operatorButton) {
    operatorButton.classList.add("highlight");
  }
}

function removeOpHighlight() {
  const highlightButtons = document.querySelectorAll(".highlight");
  highlightButtons.forEach(button => button.classList.remove("highlight"));
}