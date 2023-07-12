// Declare variables for the images
let rockImg, paperImg, scissorsImg;
let n_entities = 300;
let h = 900;
let w = 1900;
let round_winner = null;
let showVision = false;
let isResetScheduled = false;
let winnerDisplay = null;
let timeTillRestart = 5; // Time in seconds before restarting the sim 
let winnerDisplayTime = 5; // Time in seconds to display the winner

let lowEndofVision = 1;
let highEngofVision = 150;

let lowEndofSpeed = 1;
let highEngofSpeed = 3;

// Create an array to hold all the entities
let entities = [];

function preload() {
  // Load the images
  rockImg = loadImage('./pictures/the_rock.png');
  paperImg = loadImage('./pictures/paper.png');
  scissorsImg = loadImage('./pictures/scissors.png');

  RockdeathSound = loadSound('./sounds/rocks-6129.mp3');
  ScissorsdeathSound = loadSound('./sounds/sissors-40021.mp3');
  PaperdeathSound = loadSound('./sounds/crumbling-paper-6163.mp3');
}

function countTribes() {
  let counts = { rock: 0, paper: 0, scissors: 0, total: 0 };
  for (let entity of entities) {
    counts[entity.tribe]++;
    counts.total++;
  }

  // Check if only one tribe is left
  if (counts.rock > 0 && counts.paper === 0 && counts.scissors === 0) {
    counts.winner = "Rock";
  } else if (counts.rock === 0 && counts.paper > 0 && counts.scissors === 0) {
    counts.winner = "Paper";
  } else if (counts.rock === 0 && counts.paper === 0 && counts.scissors > 0) {
    counts.winner = "Scissors";
  }

  if (!round_winner) {
    round_winner = counts.winner;
  }

  return counts;
}

// reset function
function reset() {
  // Clear entities array
  entities = [];

  // Reset round_winner
  round_winner = null;

  // Spawn new entities
  for (let i = 0; i < n_entities; i++) {
    let x = random(width);
    let y = random(height);
    let tribe = random(["rock", "paper", "scissors"]);
    let visionRadius = random(lowEndofVision, highEngofVision);
    let speed = random(lowEndofSpeed, highEngofSpeed);
    entities.push(new Entity(x, y, tribe, visionRadius, speed));
  }
}

function setup() {
  let canvas = createCanvas(w, h);
  canvas.parent('canvasContainer');
  
  // Reset the game
  reset();

  // Get the button element and set up the event handler
  let btn = select('#toggle-vision');
  btn.mousePressed(() => {
    showVision = !showVision; // Toggle the vision visibility state
  });
}

function draw() {
  background(220);
  
  // Move and draw all entities
  for (let i = entities.length - 1; i >= 0; i--) {
    let entity = entities[i];
    entity.move();
    entity.draw();
    if (entity.lifespan <= 0) {
      entities.splice(i, 1);  // Remove the entity
    }
  }

  // Count tribes and display counts
  let counts = countTribes();
  textSize(15);
  fill(0);
  textAlign(RIGHT, TOP);
  text(`The Rock: ${counts.rock}`, width - 10, 10);
  text(`Paper: ${counts.paper}`, width - 10, 30);
  text(`Scissors: ${counts.scissors}`, width - 10, 50);
  text(`Total: ${counts.total} / ${n_entities}`, width - 10, 70);

  // Display the winner if there is one
  if (round_winner && !isResetScheduled) {
    textAlign(CENTER, CENTER);
    textSize(50);
    text(`${round_winner} has won!`, width / 2, height / 2);

    console.log(round_winner + " has won!")

    winnerDisplay = round_winner;
    
    setTimeout(() => {
      winnerDisplay = null;
    }, winnerDisplayTime * 1000);
    
    // Schedule a reset after n seconds and mark it as scheduled
    setTimeout(() => {
      reset();
      isResetScheduled = false; // Reset the flag once the reset is done
    }, timeTillRestart * 1000);
    isResetScheduled = true; // Mark the reset as scheduled
  }

  // If there is a winner to display, display it
  if (winnerDisplay) {
    textAlign(CENTER, CENTER);
    textSize(50);
    text(`${winnerDisplay} has won!`, width / 2, height / 2);
  }
}

