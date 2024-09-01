// Colours list
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

// Cocktails List
let cocktails = {
  1: "Margarita",
  2: "Mojito",
  3: "Old Fashioned",
  4: "Cosmopolitan",
  5: "Martini",
  6: "Daiquiri",
  7: "Pina Colada",
  8: "Negroni",
  9: "Whiskey Sour",
  10: "Manhattan",
  11: "Mai Tai",
  12: "Gin and Tonic",
  13: "Tequila Sunrise",
  14: "Bloody Mary",
};

let specials = [];

// Glass Filling Vars
let fillLevel = 0;          
let targetFill = 0;         
let maxFill = 110;         
let fillSpeed = 4;         
let increment = 20;        
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

// Snowflake Vars
let snowflakes = [];
let numSnowflakes = 35;

// Light Vars
let lightFlickering = true; 
let lightOn = true;         
let overlayAlpha = 0;   

// Bell Vars
let bellClicked = false;
let bellVibrationAmplitude = 2;
let bellVibrationFrequency = 0.5;
let bellVibrationDecay = 0.95;

// Ice Vars
let iceCubes = []; 
let prevGlassX;

// Lemon Vars
let lemonSliceAdded = false; 
let lemonSliceOffsetX = 25;
let lemonSliceOffsetY =25; 


function setup() {
  createCanvas(1280, 800);
  artworkBackground();
  
  // Add new bottles to array
  bottles.push(new Bottle(10, 35, 45, 100, '#D71818', increment)); 
  bottles.push(new Bottle(70, 35, 45, 100, '#9A2424', increment)); 
  bottles.push(new Bottle(130, 35, 45, 100, '#E3A556', increment)); 
  bottles.push(new Bottle(190, 35, 45, 100, '#EEF039', increment)); 
  bottles.push(new Bottle(250, 35, 45, 100, '#839A00', increment)); 
  bottles.push(new Bottle(310, 35, 45, 100, '#6BB641', increment)); 
  bottles.push(new Bottle(370, 35, 45, 100, '#76C7BB', increment)); 
  bottles.push(new Bottle(430, 35, 45, 100, '#297FC6', increment)); 
  bottles.push(new Bottle(490, 35, 45, 100, '#09318D', increment)); 
  bottles.push(new Bottle(550, 35, 45, 100, '#7525C5', increment)); 
  bottles.push(new Bottle(610, 35, 45, 100, '#B416B6', increment)); 
  bottles.push(new Bottle(670, 35, 45, 100, '#C83290', increment)); 

  // Snowflake logic
    for (let i = 0; i < numSnowflakes; i++) {
    let snowX = random(1050, 1050 + 200);
    let snowY = random(252, 252 + 297);
    let flakespeed = random(0.25, 1);
    snowflakes.push({x: snowX, y: snowY, flakespeed: flakespeed});
  }
  
  // Specials board logic
  let cocktailKeys = Object.keys(cocktails);
  while (specials.length < 4) {
    let randomIndex = int(random(cocktailKeys.length));
    let selectedKey = cocktailKeys[randomIndex];
    if (!specials.includes(cocktails[selectedKey])) {
      specials.push(cocktails[selectedKey]);
    }
  }
  
  // Ice Logic
  prevGlassX = glassX;

}
function draw() {
  artworkBackground();
  drawBell(800, 600, 45); 
  drawBottomShelfBottles(); 

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
  
  // Lemon Logic
 if (lemonSliceAdded) {
  push();
  translate(glassX + 65, glassY + 10 ); 
  scale(-1, 1); 
  stroke('#A99800')
strokeWeight(2)
   fill('#FBEC66');
  arc(0, 0, 25, 25, HALF_PI, TWO_PI);
   
  pop();
}

  // Check if hovering over the glass
  if (mouseX > glassX && mouseX < glassX + glassWidth && mouseY > glassY && mouseY < glassY + glassHeight) {
    cursor('pointer'); 
    isHoveringOverInteractable = true;
  }

  // Check if hovering over the bell
 if (dist(mouseX, mouseY, 800 + 45 / 2, 600 + 45 / 2) < 45 / 2) {  
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
  
    // Check if hovering over the light
  if (dist(mouseX, mouseY, 1050, 150) < 25) {  
    cursor('pointer');  
    isHoveringOverInteractable = true;
  }
  
  // Check if hovering over window
    if (mouseX > 1050 && mouseX < 1250 && mouseY > 252 && mouseY < 549) {  
    cursor('pointer');  
    isHoveringOverInteractable = true;
  }
  
  // Check if hovering over ice bucket
    if (mouseX > 680  && mouseX < 740 && mouseY > 380  && mouseY < 430) {
    cursor('pointer');
    isHoveringOverInteractable = true;
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
    fill('white')
    text("Enjoy your drink!", glassX + glassWidth / 2, glassY - 10);
  }
  
    // Ice logic
 for (let i = 0; i < iceCubes.length; i++) {
    let ice = iceCubes[i];
    let bobbingY = sin(frameCount * 0.1 + ice.bobOffset) * 2;
    
    // Adjust ice position to sit on the fill level, or at 635px if fill level is 0
    if (fillLevel > 20) {
      ice.y = glassY + glassHeight - fillLevel + 10;
    } else {
      ice.y = 615;
    }
    fill('#D3E4E91E'); 
   stroke('white')
    rect(ice.x, ice.y + bobbingY, 15, 15, 3);
  }
  
  // Add dark overlay if the light is off
  if (!lightOn) {
    overlayAlpha = min(overlayAlpha + 10, 150);
  } else {
    overlayAlpha = max(overlayAlpha - 10, 0);
  }
  
 // Check if hovering over Bottle One
  if (mouseX > 15 && mouseX < 90 && mouseY > 380 && mouseY < 435) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  // Check if hovering over Bottle Two
  if (mouseX > 120 && mouseX < 160 && mouseY > 335 && mouseY < 425) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  // Check if hovering over Bottle Three
  if (mouseX > 190 && mouseX < 230 && mouseY > 310 && mouseY < 433) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  // Check if hovering over Bottle Four
  if (mouseX > 260 && mouseX < 300 && mouseY > 311 && mouseY < 435) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  // Check if hovering over Bottle Five
  if (mouseX > 330 && mouseX < 370 && mouseY > 360 && mouseY < 455) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  // Check if hovering over Bottle Six
  if (mouseX > 400 && mouseX < 440 && mouseY > 340 && mouseY < 435) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  // Check if hovering over Bottle Seven
  if (mouseX > 470 && mouseX < 510 && mouseY > 335 && mouseY < 435) {
    cursor('pointer');
    isHoveringOverInteractable = true;
  }

  fill(0, 0, 0, overlayAlpha);
  rect(0, 0, width, height);

}

function mousePressed() {
  
  // Check if the glass is clicked
  if (mouseX > glassX && mouseX < glassX + glassWidth && mouseY > glassY && mouseY < glassY + glassHeight) {
    dragging = true;
    offsetX = mouseX - glassX; 
  }
  
  // Check if lemon bowl is clicked
    let lemonBowlHover = mouseX > 590 && mouseX < 660 && mouseY > 380 && mouseY < 440;
  if (lemonBowlHover && !lemonSliceAdded) {
    lemonSliceAdded = true;
    lemonSliceOffsetX = glassWidth - 20;
    lemonSliceOffsetY = -10;
  }

  // Check if the bell is clicked
 if (dist(mouseX, mouseY, 800 + 45 / 2, 600 + 45 / 2) < 45 / 2) { 
    resetDrink();
    bellClicked = true;
  }
  
  // Check if bottle is clicked
  if (!glassFilled) {  
    for (let bottle of bottles) {
      bottle.checkClick();
    }
  }

  // Check if the light is clicked
  if (dist(mouseX, mouseY, 1050, 150) < 25) {  
    lightOn = !lightOn;
  }
  
  // Check if the window is clicked
  if (mouseX > 1050 && mouseX < 1250 && mouseY > 252 && mouseY < 549) {  
    for (let i = 0; i < snowflakes.length; i++) {
      snowflakes[i].flakespeed += 0.2;  
    }
    
    // Add more snowflakes with each click
    let additionalFlakes = 5;
    for (let i = 0; i < additionalFlakes; i++) {
      let snowX = random(1050, 1050 + 200);
      let snowY = 252;
      let flakespeed = random(0.5, 1); 
      snowflakes.push({x: snowX, y: snowY, flakespeed: flakespeed});
    }
  }
  
  // Check if ice bucket is clicked
if (mouseX > 680 && mouseX < 680 + 60 && mouseY > 380 && mouseY < 380 + 50) {
  if (!glassFilled) {
    let ice = {
      x: glassX + random(0, glassWidth - 25),
      y: fillLevel > 0 ? glassY + glassHeight - fillLevel : 615, 
      bobOffset: random(0, TWO_PI) 
    };
    iceCubes.push(ice);
  }
}
 // Bottom Bottle Logic
    if (mouseX > 15 && mouseX < 90 && mouseY > 380 && mouseY < 435) {
    addLiquidToGlass(color('#9B5C17')); // Bottle One
  }

  if (mouseX > 120 && mouseX < 160 && mouseY > 335 && mouseY < 430) {
    addLiquidToGlass(color('#83613C')); // Bottle Two
  }

  if (mouseX > 190 && mouseX < 230 && mouseY > 310 && mouseY < 433) {
    addLiquidToGlass(color('#CEF4F0')); // Bottle Three
  }

  if (mouseX > 260 && mouseX < 300 && mouseY > 311 && mouseY < 435) {
    addLiquidToGlass(color('#FFFFFF')); // Bottle Four
  }

  if (mouseX > 330 && mouseX < 370 && mouseY > 360 && mouseY < 455) {
    addLiquidToGlass(color('#1DB235')); // Bottle Five
  }

  if (mouseX > 400 && mouseX < 440 && mouseY > 340 && mouseY < 435) {
    addLiquidToGlass(color('#540092')); // Bottle Six
  }

  if (mouseX > 470 && mouseX < 510 && mouseY > 335 && mouseY < 435) {
    addLiquidToGlass(color('#7E4F00')); // Bottle Seven
  }

}
function mouseDragged() {
  if (dragging) {
    // Drag glass
    let dx = mouseX - offsetX - glassX;
    glassX = mouseX - offsetX;
    glassX = constrain(glassX, 20, 800 - glassWidth - 10);
  
    // Ice cube logic
    for (let i = 0; i < iceCubes.length; i++) {
      iceCubes[i].x += dx; 
    }
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
  iceCubes = [];
  lemonSliceAdded = false;
}

// Class for reusable bottle components on top shelf
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
    fill('rgb(4,32,18)');
    noStroke();
    rect(0, 55, this.w, this.h, 5); 
    rect(0, 35, this.w, this.h, 200);
    rect(this.w * 0.35, 0, this.w * 0.3, 50, 2);
    // Draw the bottle label
    fill('rgb(255,245,223)');    
    rect(0, 65, this.w, 25);
    fill(this.color); 
    rect(0, 90, this.w, 5)
    circle(23, 77, 15 )
    fill('rgb(128,96,77)');
    rect(this.w * 0.35, 0, this.w * 0.3, 5, 2); 
    pop();
  }

  checkClick() {
    // Filling logic
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
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h + 50; 
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
  
  // Lights
   let lightBrightness = 255;
  if (lightFlickering && lightOn) {
    lightBrightness = 200 + sin(frameCount * 0.1) * 55;
  } else if (!lightOn) {
    lightBrightness = 0;
  }
  
  fill('#390000');
  rect(1048, 0, 5, 125); 
  arc(1050, 148, 80, 15, 0, PI);
  for (let r = 25; r > 0; r -= 4) {
    let alpha = map(r, 60, 0, 0, lightBrightness);
    fill(255, 242, 212, alpha);
    circle(1050, 150, r);
  }
  fill('#5C0000');
  arc(1050, 148, 80, 60, PI, TWO_PI);
  arc(1050, 125, 25, 25, PI, TWO_PI);
    
  // Menu
  fill('#390000');
  stroke('#52100B')
  strokeWeight(1)
  rect(875, 250, 150, 300, 3)
  stroke(colors.lightCream);
  fill('#5C0000');
  rect(885, 260, 130, 280, 3)
  noStroke()
  
  // Menu Text
  fill('rgb(255,238,221)')
  textSize(13)
  textAlign(CENTER);
  text('Today\'s Specials', 950, 300)
  text(specials[0], 950, 350)
  text(specials[1], 950, 400)
  text(specials[2], 950, 450)
  text(specials[3], 950, 500)
  
  // Window
  noFill();
  stroke('#4B2301')
  strokeWeight(7);
  rect(1050, 252, 200, 297)
  stroke('#3C2A26')

  strokeWeight(5);
  rect(1050, 252, 200, 297)

  // Draw window background
  push();
  fill('#04005F'); 
  rect(1050, 252, 200, 297);

  // Draw bg mountains
  noStroke();
  fill('#0A083A'); 
  beginShape();
  vertex(1050, 460);
  vertex(1080, 380); 
  vertex(1140, 300);
  vertex(1200, 360); 
  endShape(CLOSE);

  // Draw front mountains
  fill('#030039'); 
  beginShape();
  vertex(1050, 400);
  vertex(1100, 320); 
  vertex(1150, 400);
  vertex(1200, 300);
  vertex(1250, 400);
  vertex(1250, 549); 
  vertex(1050, 549); 
  endShape(CLOSE);
  
  // Draw snowflakes
  fill('#FFFFFF'); 
  for (let i = 0; i < snowflakes.length; i++) {
    let flake = snowflakes[i];
    flake.y += flake.flakespeed;
    if (flake.y <= 550) {
      ellipse(flake.x, flake.y, 5, 5);
    }
    if (flake.y > height) {
      flake.y = 252; 
    }
  }
  pop();
    
  // Glass panes
  fill('#C2AE966B');
  rect(1050, 252, 200, 297)
        
  strokeWeight(8)
  stroke('#4B2301')
  line(1150, 252, 1150, 548)
  line(1050, 400, 1250, 400)
  strokeWeight(6)
  stroke('#3C2A26')
  
  // Window 
  line(1150, 252, 1150, 548)
  line(1050, 400, 1250, 400)
  strokeWeight(1)
  noStroke()
  
 // Ice Bowl Hover and Bobbing Effect
  push();
  let iceBowlHover = mouseX > 680 && mouseX < 740 && mouseY > 380 && mouseY < 440;
  if (iceBowlHover) {
    cursor('pointer');
    isHoveringOverInteractable = true;
    translate(710, 415); 
    scale(1.1);
    translate(-710, -415); 
  }
  let iceBowlBob = iceBowlHover ? sin(frameCount * 0.1) * 5 : 0; 
  translate(0, iceBowlBob); 
  noFill();
  strokeWeight(1);
  stroke('#FFFFFF');
  rect(710, 395, 10, 10);
  rect(695, 395, 10, 10);
  rect(682, 397, 10, 10);
  rect(723, 396, 10, 10);
  noStroke();
  fill('#899DA5'); 
  arc(710, 435, 45, 35, PI, TWO_PI);
  fill('#AEC0C9'); 
  arc(710, 400, 70, 55, 0, PI);
  pop();

  // Lemon Bowl Hover and Bobbing Effect
  push();
  let lemonBowlHover = mouseX > 590 && mouseX < 660 && mouseY > 380 && mouseY < 440;
  if (lemonBowlHover) {
    cursor('pointer');
    isHoveringOverInteractable = true;
    translate(625, 415); 
    scale(1.1); 
    translate(-625, -415); 
  }
  let lemonBowlBob = lemonBowlHover ? sin(frameCount * 0.1) * 5 : 0; 
  translate(0, lemonBowlBob); 
  fill('#E6C54F');
  ellipse(625, 399, 35, 25); 
  ellipse(608, 399, 10, 5); 
  ellipse(642, 399, 10, 5); 
  noStroke();
  fill('#BBA58F');
  arc(625, 435, 45, 35, PI, TWO_PI); 
  fill('#D8C1A8');
  arc(625, 400, 70, 55, 0, PI); 
  pop();
}

// Draw the stools
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
  // Vibration Logic
  if (bellClicked) {
    bellVibrationAmplitude *= bellVibrationDecay; 
    if (abs(bellVibrationAmplitude) < 0.1) {
      bellClicked = false; 
      bellVibrationAmplitude = 2;
    }
  }
  let bellXOffset = bellClicked ? sin(frameCount * bellVibrationFrequency) * bellVibrationAmplitude : 0;
  fill(150);
  stroke(100);
  ellipse(x + size / 2 + bellXOffset, y + size * 0.32, size * 0.2, size * 0.2); 
  arc(x + size / 2 + bellXOffset, y + size * 0.8, size, size, PI, TWO_PI); 
  rect(x + bellXOffset, y + 38, size, 3, 5);
}

// Function for custom bottles
function drawBottomShelfBottles() {
  noStroke()
  // Bottle One
  push();
  let bottleOneHover = mouseX > 15 && mouseX < 90 && mouseY > 380 && mouseY < 435;
  if (bottleOneHover) {
    cursor('pointer');
    scale(1.1);
    translate(-(15 * 0.1), -(380 * 0.1)); 
  }
  let bottleOneBob = bottleOneHover ? sin(frameCount * 0.1) * 5 : 0; 
  translate(0, bottleOneBob); 
  noStroke();
  fill('#784C1C'); 
  rect(15, 380, 75, 55, 25); 
  rect(45, 360, 15, 35, 5);
  fill('#6B451A'); 
  rect(40, 352, 25, 20, 5); 
  fill('#F6EACE'); 
  rect(15, 397, 75, 15, 3); 
  fill('#950A01'); 
  rect(15, 402, 75, 5); 
  pop();

  // Bottle Two
  push();
  let bottleTwoHover = mouseX > 120 && mouseX < 160 && mouseY > 335 && mouseY < 430;
  if (bottleTwoHover) {
    cursor('pointer');
    scale(1.1); 
    translate(-(120 * 0.1), -(360 * 0.1)); 
  }
  let bottleTwoBob = bottleTwoHover ? sin(frameCount * 0.1) * 5 : 0; 
  translate(0, bottleTwoBob);
  fill('#83613C'); 
  rect(120, 360, 40, 75); 
  fill('#664B2E'); 
  rect(120, 355, 40, 5, 2); 
  rect(120, 430, 40, 5, 2); 
  fill('#83613C'); 
  rect(133, 335, 15, 45, 2);
  fill('#BFAB97'); 
  rect(133, 335, 15, 5); 
  fill('#C20000'); 
  rect(120, 385, 40, 25); 
  fill('#FFFFFF'); 
  circle(140, 397, 15);
  fill('#FFA000'); 
  rect(120, 410, 40, 5); 
  pop();

  // Bottle Three
  push();
  let bottleThreeHover = mouseX > 190 && mouseX < 230 && mouseY > 310 && mouseY < 433;
  if (bottleThreeHover) {
    cursor('pointer');
    scale(1.1); 
    translate(-(190 * 0.1), -(310 * 0.1));
  }
  let bottleThreeBob = bottleThreeHover ? sin(frameCount * 0.1) * 5 : 0;
  translate(0, bottleThreeBob);
  fill('#9D9D9D'); 
  rect(205, 310, 10, 45); 
  fill('#BFBDBD'); 
  rect(205, 310, 10, 5); 
  fill('#98DAF9'); 
  rect(190, 335, 40, 98, 5); 
  fill('#FFFFFF'); 
  stroke(1);
  rect(197, 365, 25, 60, 25); 
  noStroke();
  pop();

  // Bottle Four
  push();
  let bottleFourHover = mouseX > 260 && mouseX < 300 && mouseY > 311 && mouseY < 435;
  if (bottleFourHover) {
    cursor('pointer');
    scale(1.1); 
    translate(-(260 * 0.1), -(311 * 0.1));
  }
  let bottleFourBob = bottleFourHover ? sin(frameCount * 0.1) * 5 : 0;
  translate(0, bottleFourBob); 
  fill('#DEDCDC'); 
  rect(260, 360, 40, 75); 
  triangle(280, 335, 260, 360, 300, 360);   
  rect(275, 311, 10, 35, 2);
  fill('#C20000'); 
  rect(260, 365, 40, 45); 
  rect(275, 326, 10, 5);
  fill('#DEDCDC'); 
  rect(270, 370, 20, 5, 5);
  rect(265, 380, 30, 5, 5);
  rect(265, 400, 30, 5, 5);
  pop();

  // Bottle Five
  push();
  let bottleFiveHover = mouseX > 330 && mouseX < 370 && mouseY > 360 && mouseY < 455;
  if (bottleFiveHover) {
    cursor('pointer');
    scale(1.1);
    translate(-(330 * 0.1), -(360 * 0.1)); 
  }
  let bottleFiveBob = bottleFiveHover ? sin(frameCount * 0.1) * 5 : 0; 
  translate(0, bottleFiveBob);
  fill('#003108'); 
  rect(342, 360, 15, 45, 2);
  fill('#DEDCDC'); 
  rect(342, 360, 15, 5);
  fill('#003108'); 
  rect(330, 380, 40, 55, 2); 
  fill('#FFFFFF');
  stroke('#008916');
  rect(335, 390, 30, 37, 2); 
  fill('#003108'); 
  noStroke();
  circle(350, 408, 15);
  pop();

  // Bottle Six
  push();
  let bottleSixHover = mouseX > 400 && mouseX < 440 && mouseY > 340 && mouseY < 435;
  if (bottleSixHover) {
    cursor('pointer');
    scale(1.1);
    translate(-(400 * 0.1), -(340 * 0.1)); 
  }
  let bottleSixBob = bottleSixHover ? sin(frameCount * 0.1) * 5 : 0;
  translate(0, bottleSixBob);
  fill('#FFE9C2'); 
  rect(415, 340, 10, 25, 5); 
  fill('#34005A'); 
  rect(415, 340, 10, 5); 
  rect(400, 360, 40, 75, 5); 
  fill('#FFE9C2'); 
  rect(400, 405, 40, 25); 
  pop();

  // Bottle Seven
  push();
  let bottleSevenHover = mouseX > 470 && mouseX < 510 && mouseY > 335 && mouseY < 435;
  if (bottleSevenHover) {
    cursor('pointer');
    scale(1.1);
    translate(-(470 * 0.1), -(335 * 0.1)); 
  }
  let bottleSevenBob = bottleSevenHover ? sin(frameCount * 0.1) * 5 : 0;
  translate(0, bottleSevenBob);
  fill('#002C05'); 
  rect(470, 360, 40, 75, 5); 
  triangle(490, 335, 475, 360, 505, 360);   
  rect(485, 331, 10, 35, 2);
  fill('#D0CFCE'); 
  rect(475, 375, 30, 55, 5); 
  fill('#004608'); 
  rect(485, 331, 10, 5);
  fill('white');
  rect(482, 397, 15, 25, 55);
  pop();
}

// Liquid for bottom shelf bottles
function addLiquidToGlass(newColor) {
  if (!glassFilled) {
    targetFill += increment;
    let existingColor = liquidColors.find(lc => lc.color.toString() === newColor.toString());
    if (existingColor) {
      existingColor.amount += increment;
    } else {
      liquidColors.push({ color: newColor, amount: increment });
    }
    if (targetFill > maxFill) {
      targetFill = maxFill;
    }
    if (liquidColors.reduce((acc, val) => acc + val.amount, 0) > maxFill) {
      let excess = liquidColors.reduce((acc, val) => acc + val.amount, 0) - maxFill;
      liquidColors[liquidColors.length - 1].amount -= excess;
    }
  }
}


function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}

