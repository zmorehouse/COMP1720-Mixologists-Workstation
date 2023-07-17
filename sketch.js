function setup() {
  // create the canvas (1200px wide, 800px high)
  createCanvas(1200, 800);

  // draw a border to help you see the size
  // this isn't compulsory (remove this code if you like)
  strokeWeight(5);
  rect(0, 0, width, height);
}

function draw() {
  // your cool workstation code goes in this draw function
  
}

// when you hit the spacebar, what's currently on the canvas will be saved (as a
// "thumbnail.png" file) to your downloads folder
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}
