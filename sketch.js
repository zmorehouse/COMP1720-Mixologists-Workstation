let fillLevel = 0;          // Current fill level
let targetFill = 0;         // Target fill level
let maxFill = 150;          // Maximum fill level
let fillSpeed = 4;          // Speed at which the glass fills
let increment = 30;         // Amount to fill with each click

let liquidColors = [];      // Store the colors of the liquid
let glassFilled = false;    // Flag to check if the glass is full

let bottles = [];           // Array to store all bottle objects

let glassX = 600;           // Initial x-position of the glass
let glassY = 500;           // y-position of the glass (fixed)
let glassWidth = 100;       // Width of the glass
let glassHeight = 150;      // Height of the glass
let dragging = false;       // Flag to check if the glass is being dragged
let offsetX = 0;            // Offset to maintain relative position while dragging

let bellX = 1100;           // x-position of the bell
let bellY = 590;            // y-position of the bell (aligned with the glass)
let bellSize = 80;          // Size of the bell

function setup() {
  createCanvas(1280, 800);  // Adjust canvas size to 1280x800

  // Define bottles with different properties on two shelves
  let shelfWidth = 0.75 * width;  // 75% of canvas width
  let bottleWidth = shelfWidth / 4 - 20; // Space for 4 bottles per shelf with padding
  let bottleHeight = 150;
  
  // First shelf (y position = 100)
  bottles.push(new Bottle(40, 100, bottleWidth, bottleHeight, '#C83232', increment));  // Red bottle
  bottles.push(new Bottle(40 + bottleWidth + 20, 100, bottleWidth, bottleHeight, '#32C832', increment));  // Green bottle
  bottles.push(new Bottle(40 + 2 * (bottleWidth + 20), 100, bottleWidth, bottleHeight, '#3232C8', increment));  // Blue bottle
  bottles.push(new Bottle(40 + 3 * (bottleWidth + 20), 100, bottleWidth, bottleHeight, '#FFFF32', increment));  // Yellow bottle

  // Second shelf (y position = 300)
  bottles.push(new Bottle(40, 300, bottleWidth, bottleHeight, '#FF5733', increment));  // Orange bottle
  bottles.push(new Bottle(40 + bottleWidth + 20, 300, bottleWidth, bottleHeight, '#33FFBD', increment));  // Cyan bottle
  bottles.push(new Bottle(40 + 2 * (bottleWidth + 20), 300, bottleWidth, bottleHeight, '#FF33FF', increment));  // Magenta bottle
  bottles.push(new Bottle(40 + 3 * (bottleWidth + 20), 300, bottleWidth, bottleHeight, '#A832FF', increment));  // Purple bottle
}

function draw() {
  background(220);

  // Draw the table
  fill(150);
  rect(0, glassY + glassHeight, width, 30);  // Table rectangle

  // Draw the concierge bell
  drawBell(bellX, bellY, bellSize);

  // Calculate the color of the liquid based on the amounts of each color
  let totalAmount = liquidColors.reduce((acc, val) => acc + val.amount, 0);
  let liquidColor = color(0, 0, 0);

  // Compute the mixed color of the liquid
  if (totalAmount > 0) {
    let r = 0, g = 0, b = 0;
    for (let lc of liquidColors) {
      let colorRatio = lc.amount / totalAmount;
      r += colorRatio * red(lc.color);
      g += colorRatio * green(lc.color);
      b += colorRatio * blue(lc.color);
    }
    liquidColor = color(min(255, r), min(255, g), min(255, b));
  }

  // Constrain the glass so it doesn't overlap with the bell
  glassX = constrain(glassX, 0, bellX - glassWidth - 10);

  // Draw the glass outline
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(glassX, glassY, glassWidth, glassHeight);  // A basic rectangular glass shape

  // Draw the liquid in the glass
  noStroke();
  fill(liquidColor);  // Color determined by the mixture of liquids
  rect(glassX, glassY + glassHeight - fillLevel, glassWidth, fillLevel);  // Fill the glass from the bottom up

  // Draw all bottles
  for (let bottle of bottles) {
    bottle.display();
  }

  // Smoothly animate the liquid filling
  if (fillLevel < targetFill) {
    fillLevel += fillSpeed;
    if (fillLevel > targetFill) {
      fillLevel = targetFill;  // Ensure we don't overfill
    }
  }

  // Check if the glass is filled
  if (fillLevel >= maxFill) {
    glassFilled = true;
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Enjoy your drink!", glassX + glassWidth / 2, glassY - 10);
  }
}

function mousePressed() {
  // Check if the glass is clicked to start dragging
  if (mouseX > glassX && mouseX < glassX + glassWidth && mouseY > glassY && mouseY < glassY + glassHeight) {
    dragging = true;
    offsetX = mouseX - glassX;  // Calculate offset for smooth dragging
  }

  // Check if the bell is clicked
  if (dist(mouseX, mouseY, bellX + bellSize / 2, bellY + bellSize / 2) < bellSize / 2) {
    resetDrink();
  }

  if (!glassFilled) {  // Only allow filling if the glass isn't full
    for (let bottle of bottles) {
      bottle.checkClick();
    }
  }
}

function mouseDragged() {
  // Drag the glass horizontally if dragging is active
  if (dragging) {
    glassX = mouseX - offsetX;
    // Constrain the glass within the canvas width and before the bell
    glassX = constrain(glassX, 0, bellX - glassWidth - 10);
  }
}

function mouseReleased() {
  // Stop dragging when the mouse is released
  dragging = false;
}

function resetDrink() {
  fillLevel = 0;
  targetFill = 0;
  liquidColors = [];
  glassFilled = false;
}

// Function to draw the concierge bell
function drawBell(x, y, size) {
  // Draw the bell base
  fill(150);
  stroke(0);
  strokeWeight(2);

  arc(x + size / 2, y + size * 0.8, size, size, PI, TWO_PI);  // Dome of the bell

  ellipse(x + size / 2, y + size * 0.25, size * 0.2, size * 0.2);  // Button on top
}

class Bottle {
  constructor(x, y, w, h, hexColor, increment) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color(hexColor);
    this.increment = increment;
    this.amount = 0;
  }

  display() {
    // Check if the mouse is hovering over the bottle
    let isHovering = mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;

    push();  // Save the current transformation matrix

    // Apply scaling and bobbing effect if hovering
    if (isHovering) {
      translate(this.x + this.w / 2, this.y + this.h / 2); // Move to the center of the bottle
      scale(1.1); // Scale up slightly
      translate(-this.w / 2, -this.h / 2); // Move back to original position
      translate(0, sin(frameCount * 0.1) * 5); // Bobbing effect
    } else {
      translate(this.x, this.y);
    }

    // Draw the bottle
    stroke(0);
    strokeWeight(2);
    fill(this.color);
    rect(0, 0, this.w, this.h);  // Bottle body
    ellipse(this.w / 2, 0, this.w, 30);  // Bottle top

    pop();  // Restore the transformation matrix
  }

  checkClick() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      targetFill += this.increment;
      this.amount += this.increment;

      let existingColor = liquidColors.find(lc => lc.color.toString() === this.color.toString());
      if (existingColor) {
        existingColor.amount += this.increment;
      } else {
        liquidColors.push({ color: this.color, amount: this.increment });
      }

      if (targetFill > maxFill) {
        targetFill = maxFill;
      }
      if (liquidColors.reduce((acc, val) => acc + val.amount, 0) > maxFill) {
        this.amount = maxFill - liquidColors.reduce((acc, val) => acc + val.amount, 0) + this.amount;
      }
    }
  }
}
