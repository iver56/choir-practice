function relativeMouseCoords(e, canvas) {
  if (e.type !== "touchstart") {
    e.preventDefault();
  }

  let currentElement = canvas;
  let totalOffsetX = 0;
  let totalOffsetY = 0;

  do {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
  }
  while (currentElement = currentElement.offsetParent);

  const canvasX = (e.pageX || (e.touches && e.touches[0] && e.touches[0].pageX)) - totalOffsetX;
  const canvasY = (e.pageY || (e.touches && e.touches[0] && e.touches[0].pageY)) - totalOffsetY;

  return {x: canvasX, y: canvasY}
}
