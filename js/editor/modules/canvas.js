const defaultFill = 'white';
const selectedFill = 'green';

const canvas = new fabric.Canvas('model');

// Creates the triangle model
const create = () => {
  const startPosition = {x: 10, y: 410}; // Left-bottom triangle
  const triangleSize = 40;

  for (let row = 0; row < 11; row++) {
    for (let col = row; col < (21 - row); col++) {
      canvas.add(new fabric.Triangle({
        left: startPosition.x + col * triangleSize / 2,
        top: startPosition.y - row * triangleSize,
        fill: defaultFill,
        selectable: false,
        stroke: 'black',
        strokeWidth: 1,
        flipY: (col + row) % 2 === 1,
        width: triangleSize,
        height: triangleSize,
        hoverCursor: "crosshair",
        coord: [col, row],
      }));
    }
  }

  canvas.on('mouse:down', clickHandler);
}

// recolors all triangles will default fill
const recolor = (color) => {
  canvas.getObjects()
    .filter(obj => obj.get('fill') !== defaultFill)
    .forEach(obj => obj.set('fill', color));
  canvas.renderAll();
};

// Returns pair of all selected coordinates
const selectedCoords = () => {
  const coords = canvas.getObjects()
      .filter(obj => obj.get('fill') !== defaultFill)
      .map(obj => obj.get('coord'));
  return coords.length ? JSON.stringify(coords) : ''
};

// Clears the fill of all triangles to default
const clear = () => {
  canvas.getObjects()
    .forEach(obj => obj.set('fill', defaultFill));
  canvas.renderAll();
};

// Toggles the fill of a triangle when clicked.
const clickHandler = (event) => {
  const mouse = canvas.getPointer(event, false);
  // The straightforward way of registering an event on each triangle registers clicks within the
  // triangle's bounding rectangle. This checks if it is a transparent part to register clicks correctly.
  canvas.getObjects()
    .filter(obj => obj.containsPoint(mouse) && !canvas.isTargetTransparent(obj, mouse.x, mouse.y))
    .forEach(obj => {
      obj.set('fill', obj.get('fill') === defaultFill ? selectedFill : defaultFill);
    });
};

export {create, selectedCoords, defaultFill, selectedFill, clear, recolor};