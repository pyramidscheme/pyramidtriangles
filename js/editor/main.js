import {clear, create, selectedCoords} from "./modules/canvas.js";

create();

// Appends the selected coordinates to textarea
document.getElementById('coordDump').addEventListener('click', () => {
  const newOutput = selectedCoords();
  if (newOutput) {
    document.getElementById('coordOutput').value += newOutput + '\n';
  }
});

document.getElementById('clear').addEventListener('click', clear);
