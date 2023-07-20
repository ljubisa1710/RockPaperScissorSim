// Define a class for the entities
let lowEndofVision = 1;
let highEngofVision = 150;

let lowEndofVisionMutation = -5;
let highEndofVisionMutation = 5;

let lowEndofSpeed = 1;
let highEngofSpeed = 3;

let lowEndofSpeedMutation = -0.25;
let highEndofSpeedMutation = 0.25;

let childSpawnDist = 20;// How far the child can spawn from it's parent

class Entity {
    constructor(x, y, tribe, visionRadius, speed) {
      this.x = x;
      this.y = y;
      this.safeDistance = 30; // distance from the border of the canvas at which they try to turn around
      this.secondsToLive = 60; // how long in seconds each entity has to live
      this.lifespan = this.secondsToLive * 60; // Seconds to be alive * frame rate of p5.js
      this.childChance = 0.5; // 0.5 = 50% chance of having a child after eating another entity
      this.mutateChance = 0.2; // Chance of the child slightly mutating (changing speed and vision radius)
      this.entitiy_size = 20; // Visual size of the pictures
      this.eatingDistance = this.entitiy_size / 1.5; // Entities must be this close to be eaten
      this.tribe = tribe; // "rock", "paper", or "scissors"
      this.speed = speed; // Speed of movement
      this.visionRadius = visionRadius; // Vision radius
      this.direction = random(TWO_PI); // Initial random direction
      this.changeDirectionInterval = 30; // Change direction every n frames
      this.framesUntilChangeDirection = this.changeDirectionInterval; // Countdown until change direction
    }
  
    // Determine if another entity is a friend, food, or enemy
    isFriendOrFoe(other) {
      if (this.tribe === other.tribe) {
        return "friend";
      } else if ((this.tribe === "rock" && other.tribe === "scissors") ||
                 (this.tribe === "paper" && other.tribe === "rock") ||
                 (this.tribe === "scissors" && other.tribe === "paper")) {
        return "food";
      } else {
        return "enemy";
      }
    }
  
    // Move towards a target
    moveTowards(target) {
      let angle = atan2(target.y - this.y, target.x - this.x);
      this.x += cos(angle) * this.speed;
      this.y += sin(angle) * this.speed;
    }
  
    // Move away from a target
    moveAwayFrom(target) {
      let angle = atan2(this.y - target.y, this.x - target.x);
      this.x += cos(angle) * this.speed;
      this.y += sin(angle) * this.speed;
    }
  
    // Move randomly
    moveRandomly() {
      // Decrease the countdown until change direction
      this.framesUntilChangeDirection--;
      // If it's time to change direction, choose a new random direction
      if (this.framesUntilChangeDirection <= 0) {
        this.direction = random(TWO_PI);
        this.framesUntilChangeDirection = this.changeDirectionInterval;
      }
      // Move in the current direction
      this.x += cos(this.direction) * this.speed;
      this.y += sin(this.direction) * this.speed;
    }
  
    // Move away from the boundary if close
    avoidBoundary() {
      if (this.x <= this.safeDistance) {
        this.x += this.speed * 2;
      } else if (this.x >= width - this.safeDistance) {
        this.x -= this.speed * 2;
      }
      if (this.y <= this.safeDistance) {
        this.y += this.speed * 2;
      } else if (this.y >= height - this.safeDistance) {
        this.y -= this.speed * 2;
      }
    }

    // Calculate distance between two entities
    calculateDistance(other) {
      return dist(this.x, this.y, other.x, other.y);
    }

    // Check if another entity is within vision radius
    isEntityInVision(other) {
      let distance = this.calculateDistance(other);
      return (other !== this && distance < this.visionRadius);
    }

    // Check if another entity is within eating distance
    isEntityWithinEatingDistance(other) {
      let distance = this.calculateDistance(other);
      return distance < this.eatingDistance;
    }

    // Create child entity
    createChildEntity() {
      let newX = random(this.x - childSpawnDist, this.x + childSpawnDist);
      let newY = random(this.y - childSpawnDist, this.y + childSpawnDist);
      let child = new Entity(newX, newY, this.tribe, this.visionRadius, this.speed);

      if (random() < this.mutateChance) {
        let visionMutation = this.visionRadius + random(lowEndofVisionMutation, highEndofVisionMutation);
        let newVisionRadius = Math.min(Math.max(lowEndofVision, visionMutation), highEngofVision)
        
        let speedMutation = this.speed + random(lowEndofSpeedMutation, highEndofSpeedMutation);
        let newSpeed = Math.min(Math.max(lowEndofSpeed, speedMutation), highEngofSpeed);

        child.visionRadius = newVisionRadius;
        child.speed = newSpeed;
      }

      return child;
    }

    // Play eating sound
    playEatingSound() {
      if (this.tribe == "rock") {RockeatSound.play();}
      else if (this.tribe == "scissors") {ScissorseatSound.play();}
      else if ((this.tribe == "paper")) {PapereatSound.play();}
    }

    // Check for collisions and find the nearest prey
    checkCollisionsAndFindPrey() {
      let nearestPrey = null;
      let nearestDist = Infinity;
      for (let i = entities.length - 1; i >= 0; i--) {
        let other = entities[i];
        if (this.isEntityInVision(other)) {
          let relation = this.isFriendOrFoe(other);
          if (relation === "food") {
            if (this.isEntityWithinEatingDistance(other)) {
              entities.splice(i, 1); // Eat the entity
              if (random() < this.childChance) {
                let childEntity = this.createChildEntity();
                entities.push(childEntity);
              }
              this.playEatingSound();
            } else if (this.calculateDistance(other) < nearestDist) {
              nearestPrey = other;
              nearestDist = this.calculateDistance(other);
            }
          } else if (relation === "enemy") {
            this.moveAwayFrom(other); // Move away from the enemy
          }
        }
      }
      return nearestPrey;
    }


    // Move the entity
    move() {
      // Check for collisions and find the nearest prey
      let nearestPrey = this.checkCollisionsAndFindPrey();
      if (nearestPrey) {
        // If there is prey, move towards it
        this.moveTowards(nearestPrey);
      } else {
        // If there's no prey nearby, move randomly
        this.moveRandomly();
      }

      // Avoid the boundary of the canvas
      this.avoidBoundary();
      this.lifespan--;
      if (this.lifespan <= 0) {
        if (this.tribe == "rock") {RockdeathSound.play();}
        else if (this.tribe == "scissors") {ScissorsdeathSound.play();}
        else if ((this.tribe == "paper")) {PaperdeathSound.play();}
      }
    }
  
    // Draw the entity
    draw() {
      // Draw the appropriate image based on the tribe
      imageMode(CENTER);
      if (this.tribe === "rock") {
        image(rockImg, this.x, this.y, this.entitiy_size, this.entitiy_size);
      } else if (this.tribe === "paper") {
        image(paperImg, this.x, this.y, this.entitiy_size, this.entitiy_size);
      } else { // "scissors"
        image(scissorsImg, this.x, this.y, this.entitiy_size, this.entitiy_size);
      } 
  
      if (showVision) {
        noFill(); 
        stroke(0); 
        circle(this.x, this.y, this.visionRadius * 2);
        
        fill(255, 0, 0); 
        noStroke(); 
        circle(this.x, this.y, 5); 
      
        // Set the text properties
        textSize(16);  // Set the text size
        fill(0);  // Set the fill color to black
        noStroke();  // No outline on the text
        
        let roundedSpeed = this.speed.toFixed(2);
        let roundedVision = this.visionRadius.toFixed(2);

        // Display the speed above the entity
        text('Speed: ' + roundedSpeed, this.x - 5, this.y);
        text('Vision: ' + roundedVision, this.x - 5, this.y - 15);
      }      
    }
  }