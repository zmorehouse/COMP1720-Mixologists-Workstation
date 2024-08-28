let fillLevel = 0;          // Current fill level
let targetFill = 0;         // Target fill level
let maxFill = 150;          // Maximum fill level
let fillSpeed = 4;          // Speed at which the glass fills
let increment = 30;         // Amount to fill with each click

let greenAmount = 0;        // Amount of green liquid
let redAmount = 0;          // Amount of red liquid
let blueAmount = 0;         // Amount of blue liquid
let yellowAmount = 0;       // Amount of yellow liquid

let glassFilled = false;    // Flag to check if the glass is full
let resetButton;            // Button to reset the drink

function setup() {
  createCanvas(1200, 800);  // Adjust canvas size to fit all bottles
  
  // Create reset button and position it below the glass
  resetButton = createButton('Reset Drink');
  resetButton.position(225, 370);
  resetButton.mousePressed(resetDrink);
  resetButton.hide();  // Initially hidden until the glass is filled
}

function draw() {
  background(220);

  // Calculate the color of the liquid based on the amounts of each color
  let totalAmount = greenAmount + redAmount + blueAmount + yellowAmount;
  let greenRatio = greenAmount / totalAmount || 0;
  let redRatio = redAmount / totalAmount || 0;
  let blueRatio = blueAmount / totalAmount || 0;
  let yellowRatio = yellowAmount / totalAmount || 0;

  // Vibrant color mixing formula
  let liquidColor = color(
    min(255, redRatio * 255 + greenRatio * 50 + blueRatio * 50 + yellowRatio * 255),   // Red component
    min(255, greenRatio * 255 + redRatio * 50 + blueRatio * 50 + yellowRatio * 255),   // Green component
    min(255, blueRatio * 255 + redRatio * 50 + greenRatio * 50 + yellowRatio * 50)     // Blue component
  );

  // Draw the glass outline
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(200, 200, 100, 150);  // A basic rectangular glass shape

  // Draw the liquid in the glass
  noStroke();
  fill(liquidColor);  // Color determined by the mixture of green, red, blue, and yellow liquids
  rect(200, 350 - fillLevel, 100, fillLevel);  // Fill the glass from the bottom up

  // Draw the bottles with hover effect
  drawBottle(320, 150, color(200, 50, 50));  // Red bottle
  drawBottle(130, 150, color(50, 200, 50));  // Green bottle
  drawBottle(40, 150, color(50, 50, 200));   // Blue bottle
  drawBottle(410, 150, color(255, 255, 50)); // Yellow bottle

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
    resetButton.show();  // Show reset button when the glass is full
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Enjoy your drink!", 250, 190);
    // Add any additional effects like flashing the glass or sparkles here
  }
}

function drawBottle(x, y, bottleColor) {
  // Check if the mouse is hovering over the bottle
  let isHovering = mouseX > x && mouseX < x + 50 && mouseY > y && mouseY < y + 200;

  push();  // Save the current transformation matrix

  // Apply scaling and bobbing effect if hovering
  if (isHovering) {
    translate(x + 25, y + 100); // Move to the center of the bottle
    scale(1.1); // Scale up slightly
    translate(-25, -100); // Move back to original position
    translate(0, sin(frameCount * 0.1) * 5); // Bobbing effect
  } else {
    translate(x, y);
  }

  // Draw the bottle
  stroke(0);
  strokeWeight(2);
  fill(bottleColor);
  rect(0, 0, 50, 200);  // Bottle body
  ellipse(25, 0, 50, 30);  // Bottle top

  pop();  // Restore the transformation matrix
}

function mousePressed() {
  if (!glassFilled) {  // Only allow filling if the glass isn't full
    // Check if the mouse is within the bounds of the red bottle
    if (mouseX > 320 && mouseX < 370 && mouseY > 150 && mouseY < 350) {
      targetFill += increment;
      redAmount += increment;
      if (targetFill > maxFill) {
        targetFill = maxFill;
      }
      if (redAmount + greenAmount + blueAmount + yellowAmount > maxFill) {
        redAmount = maxFill - (greenAmount + blueAmount + yellowAmount);
      }
    }

    // Check if the mouse is within the bounds of the green bottle
    if (mouseX > 130 && mouseX < 180 && mouseY > 150 && mouseY < 350) {
      targetFill += increment;
      greenAmount += increment;
      if (targetFill > maxFill) {
        targetFill = maxFill;
      }
      if (redAmount + greenAmount + blueAmount + yellowAmount > maxFill) {
        greenAmount = maxFill - (redAmount + blueAmount + yellowAmount);
      }
    }

    // Check if the mouse is within the bounds of the blue bottle
    if (mouseX > 40 && mouseX < 90 && mouseY > 150 && mouseY < 350) {
      targetFill += increment;
      blueAmount += increment;
      if (targetFill > maxFill) {
        targetFill = maxFill;
      }
      if (redAmount + greenAmount + blueAmount + yellowAmount > maxFill) {
        blueAmount = maxFill - (redAmount + greenAmount + yellowAmount);
      }
    }

    // Check if the mouse is within the bounds of the yellow bottle
    if (mouseX > 410 && mouseX < 460 && mouseY > 150 && mouseY < 350) {
      targetFill += increment;
      yellowAmount += increment;
      if (targetFill > maxFill) {
        targetFill = maxFill;
      }
      if (redAmount + greenAmount + blueAmount + yellowAmount > maxFill) {
        yellowAmount = maxFill - (redAmount + greenAmount + blueAmount);
      }
    }
  }
}

function resetDrink() {
  fillLevel = 0;
  targetFill = 0;
  greenAmount = 0;
  redAmount = 0;
  blueAmount = 0;
  yellowAmount = 0;
  glassFilled = false;
  resetButton.hide();  // Hide reset button after resetting
}

// when you hit the spacebar, what's currently on the canvas will be saved (as a
// "thumbnail.png" file) to your downloads folder
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}
