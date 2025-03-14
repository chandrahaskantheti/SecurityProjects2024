import React, {useState} from "react";
import {Container, TextField, Button, Grid} from "@mui/material";
import "./Calculator.css";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [lastOp, setLastOp] = useState(null);
  const [lastNum, setLastNum] = useState(null);
  const [calculationComp, setCalculationComp] = useState(false);
  const [highlightedOp, setHighlightedOp] = useState(null);
  const [repeatNum, setRepeatNum] = useState(null);

  const handleButtonClick = (value) => {
    if (/[0-9]/.test(value)) {
      setDisplay(prev => (prev === "0" || calculationComp ? value : prev + value));
      setCalculationComp(false);
      setHighlightedOp(null);
    }
    else if (value === ".") {
      if (!display.includes(".")) {
        setDisplay(prev => prev + ".");
      }
    }
    else if (["+", "-", "*", "/"].includes(value)) {
      if (lastOp && lastNum !== null && !calculationComp) {
        handleEquals();
      } else {
        setLastNum(parseFloat(display));
      }
      setLastOp(value);
      setRepeatNum(null);
      setCalculationComp(true);
      setHighlightedOp(value);
    }
    else if (value === "=") {
      handleEquals();
    }
    else if (value === "C") {
      setDisplay("0");
      setLastOp(null);
      setLastNum(null);
      setRepeatNum(null);
      setHighlightedOp(null);
    }
  };

  const handleEquals = () => {
    if (lastOp && lastNum !== null) {
      let num = repeatNum !== null ? repeatNum : parseFloat(display);
      let result;
      switch (lastOp) {
        case "+":
          result = lastNum + num;
          break;
        case "-":
          result = lastNum - num;
          break;
        case "*":
          result = lastNum * num;
          break;
        case "/":
          result = num !== 0 ? lastNum / num : "Error";
          break;
        default:
          result = parseFloat(display);
      }
      setDisplay(String(result));
      setLastNum(result);
      setRepeatNum(num);
      setCalculationComp(true);
      setHighlightedOp(null);
    }
  };

  return (
    <Container maxWidth="xs" className = "calculator">
      <TextField fullWidth value = {display} variant = "outlined" disabled margin = "normal" />
      <Grid container spacing = {1}>
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "=", "+", ].map((btn) => (
          <Grid item xs = {3} key = {btn}>
            <Button variant="contained" fullWidth onClick = {() => handleButtonClick(btn)} className = {highlightedOp === btn ? "highlight" : ""}>
              {btn}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Calculator;