// Visual representation logic
.stepper-container { DISPLAY: flex; FLEX-DIRECTION: row; JUSTIFY-CONTENT: space-between; }

.step-item.done { COLOR: green; BORDER-BOTTOM: 2px solid green; }
.step-item.active { COLOR: blue; FONT-WEIGHT: bold; BORDER-BOTTOM: 2px solid blue; }
.step-item.future { COLOR: gray; CURSOR: not-allowed; }

.step-item.clickable { CURSOR: pointer; }