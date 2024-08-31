// Initialise colours dictionary to store reusable colours
let colors = {
  darkBrown1: '#40292C',
  darkBrown2: '#4C342E',
  darkBrown3: '#694A43',
  mediumBrown1: '#745852',
  mediumBrown2: '#736058',
  lightBrown: '#9D8277',
  lightCream: '#E7D7C1',
  darkGray: '#656668',
  darkRed1: '#6E0F0B',
  darkRed2: '#8C1D1C',
  shelfBrown: '#624A45',
  glassOutline: 'rgba(255, 255, 255, 0.9)', 
  glassFill: 'rgba(255, 255, 255, 0.2)' 
};

// Glass Filling
let fillLevel = 0;          
let targetFill = 0;         
let maxFill = 110;         
let fillSpeed = 4;         
let increment = 30;        
let liquidColors = [];     
let glassFilled = false;    

let bottles = [];           

// Glass Vars
let glassX = 50;           
let glassY = 525;           
let glassWidth = 65;       
let glassHeight = 110;      
let dragging = false;       
let offsetX = 0;            

function setup() {
  createCanvas(1280, 800);
  artworkBackground();
  
  // Add new bottles to array
  bottles.push(new Bottle(35, 35, 45, 100, '#C83232', increment)); 
  bottles.push(new Bottle(100, 35, 45, 100, '#0082FF', increment)); 

}
function draw() {
  artworkBackground();
  drawBell(800, 600, 45); 

  let isHoveringOverInteractable = false; 

  // Colour and glass mixing
  let totalAmount = liquidColors.reduce((acc, val) => acc + val.amount, 0);
  let liquidColor = color(0, 0, 0);
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

  // Constrain and draw glass
  glassX = constrain(glassX, 0, 800 - glassWidth - 10);
  drawGlass(glassX, glassY, glassWidth, glassHeight, liquidColor);

  // Check if hovering over the glass
  if (mouseX > glassX && mouseX < glassX + glassWidth && mouseY > glassY && mouseY < glassY + glassHeight) {
    cursor('pointer'); 
    isHoveringOverInteractable = true;
  }

  // Check if hovering over the bell
  if (dist(mouseX, mouseY, 800 + 45 / 2, 600 + 45 / 2) < 45 / 2) {  // Hover detection for the bell
    cursor('pointer');  
    isHoveringOverInteractable = true;
  }

  // Draw bottles and check if hovering over them
  for (let bottle of bottles) {
    bottle.display();
    if (bottle.isMouseOver()) {
      cursor('pointer');  
      isHoveringOverInteractable = true;
    }
  }

  // Reset cursor if not hovering over any interactive elements
  if (!isHoveringOverInteractable) {
    cursor('default');
  }

  // Liquid filling logic
  if (fillLevel < targetFill) {
    fillLevel += fillSpeed;
    if (fillLevel > targetFill) {
      fillLevel = targetFill;
    }
  }
  if (fillLevel >= maxFill) {
    glassFilled = true;
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Enjoy your drink!", glassX + glassWidth / 2, glassY - 10);
  }
}

function mousePressed() {
  
  // Check if the glass is clicked
  if (mouseX > glassX && mouseX < glassX + glassWidth && mouseY > glassY && mouseY < glassY + glassHeight) {
    dragging = true;
    offsetX = mouseX - glassX; 
  }

  // Check if the bell is clicked
  if (dist(mouseX, mouseY, 800 + 45 / 2, 600 + 45 / 2) < 45 / 2) {  // Static values used here
    resetDrink();
  }
  
  // Check if bottle is clicked
  if (!glassFilled) {  
    for (let bottle of bottles) {
      bottle.checkClick();
    }
  }
}

function mouseDragged() {
  if (dragging) {
    glassX = mouseX - offsetX;
    glassX = constrain(glassX, 0, 800 - glassWidth - 10);  // Static value used here
  }
}

function mouseReleased() {
  dragging = false;
}

function resetDrink() {
  fillLevel = 0;
  targetFill = 0;
  liquidColors = [];
  glassFilled = false;
}

// Draw the glass and liquid in it
function drawGlass(x, y, w, h, liquidColor) {
  // Draw the liquid in the glass
  noStroke();
  fill(liquidColor); 
  rect(x, y + h + 5 - fillLevel, w, fillLevel, 7, 7, 10, 10);  

  // Draw the glass body
  stroke(colors.glassOutline);
  strokeWeight(1);
  fill(colors.glassFill);

  line(x, y + 10, x, y + h);         
  line(x + w, y + 10, x + w, y + h); 
  fill(colors.glassFill);
  if (fillLevel === 0) {
    ellipse(x + w / 2, y + h, w, 10); 
  } else {
    arc(x + w / 2, y + h, w, 10, 0, PI, OPEN); 
  }
  noFill();
  stroke(colors.glassOutline);
  strokeWeight(3);
  arc(x - 2, y + h / 2, 30, 40, PI / 2, 3 * PI / 2);  
  strokeWeight(1);
  fill(colors.glassFill);
  ellipse(x + w / 2, y + 10, w, 10);  
  noStroke(); 
}

// Draw the bell
function drawBell(x, y, size) {
  fill(150);
  stroke(0);
  strokeWeight(1);
  ellipse(x + size / 2, y + size * 0.25, size * 0.2, size * 0.2); 
  arc(x + size / 2, y + size * 0.8, size, size, PI, TWO_PI); 
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
    let isHovering = this.isMouseOver();
    push();

    // Apply scaling and bobbing effect if hovering
    if (isHovering) {
      translate(this.x + this.w / 2, this.y + this.h / 2); 
      scale(1.05);
      translate(-this.w / 2, -this.h / 2); 
      translate(0, sin(frameCount * 0.1) * 5); 
    } else {
      translate(this.x, this.y);
    }

    // Draw the bottle body
    fill(this.color);
    noStroke();
    rect(0, 55, this.w, this.h, 5); 
    rect(0, 35, this.w, this.h, 200);
    rect(this.w * 0.35, 0, this.w * 0.3, 50, 2);

    // Draw the bottle label
    fill('rgb(210,210,210)');
    rect(0, 65, this.w, 25); // Label

    // Draw the bottle cap
    fill(this.color);
    rect(this.w * 0.35, 0, this.w * 0.3, 5, 2); // Cap
    
    pop();
  }

  checkClick() {
    if (this.isMouseOver()) {
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

  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h + 50;  // Extended height for the neck
  }
}

function artworkBackground() {
  noStroke();
  
  // Background Wall
  fill(colors.darkBrown1);
  rect(0, 0, 1280, 800);
  
  // Forward Wall
  fill(colors.darkBrown2);
  rect(815, 0, 1280, 800);
  fill(colors.darkBrown3);
  rect(825, 0, 1280, 800);
  
  // Bar Table
  fill(colors.lightBrown);
  rect(0, 625, 925, 250);
  fill(colors.mediumBrown1);
  rect(0, 650, 900, 250);
  fill(colors.mediumBrown2);
  quad(900, 650, 900, 800, 925, 800, 925, 625);
  
  // Table Trim
  fill(colors.lightCream);
  quad(0, 650, 0, 655, 900, 655, 900, 650);
  quad(897, 650, 897, 800, 902, 800, 902, 650);
  quad(900, 650, 900, 657, 925, 631, 925, 625);
  
  // Stools
  for (let i = 0; i < 5; i++) {
    let xOffset = 173 * i; 
    drawStool(95 + xOffset, 750, 100 + xOffset, 750);
  }
  
  // Shelves
  fill(colors.shelfBrown);
  rect(0, 150, 750, 50);
  fill(colors.mediumBrown1);
  quad(0, 200, 0, 215, 730, 215, 750, 200);
  fill(colors.lightCream);
  rect(0, 210, 730, 5);
  
  fill(colors.shelfBrown);
  rect(0, 375, 750, 50);
  fill(colors.mediumBrown1);
  quad(0, 425, 0, 445, 730, 445, 750, 425);
  fill(colors.lightCream);
  rect(0, 440, 730, 5);
}

function drawStool(baseX, baseY, seatX, seatY) {
  fill(colors.darkGray);
  rect(baseX, baseY, 10, 100); 
  fill(colors.darkRed1);
  rect(seatX - 75, seatY - 50, 150, 50);
  fill(colors.darkRed2);
  ellipse(seatX, seatY - 50, 150, 25);
  fill(colors.darkRed1);
  ellipse(seatX, baseY, 150, 25); 
}

function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}
