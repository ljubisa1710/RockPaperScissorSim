// Define a class for the entities
class Entity {
    constructor(x, y, tribe, visionRadius, speed) {
      this.x = x;
      this.y = y;
      this.safeDistance = 25 // distance from the border of the canvas at which they try to turn around
      this.secondsToLive = 30; // how long in seconds each entity has to live
      this.lifespan = this.secondsToLive * 60; // Seconds to be alive * frame rate of p5.js
      this.childChance = 0.5;
      this.entitiy_size = 20 // Visual size of the pictures
      this.eatingDistance = this.entitiy_size / 2; // Entities must be this close to be eaten
      this.tribe = tribe; // "rock", "paper", or "scissors"
      this.speed = speed; // Speed of movement
      this.visionRadius = visionRadius; // Vision radius
      this.direction = random(TWO_PI); // Initial random direction
      this.changeDirectionInterval = 20; // Change direction every n frames
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
      if (this.x < this.safeDistance) {
        this.x += this.speed * 1.5;
      } else if (this.x > width - this.safeDistance) {
        this.x -= this.speed * 1.5;
      }
      if (this.y < this.safeDistance) {
        this.y += this.speed * 1.5;
      } else if (this.y > height - this.safeDistance) {
        this.y -= this.speed * 1.5;
      }
    }

    // Check for collisions and find the nearest prey
    checkCollisionsAndFindPrey() {
      let nearestPrey = null;
      let nearestDist = Infinity;
      for (let i = entities.length - 1; i >= 0; i--) {
        let other = entities[i];
        let distance = dist(this.x, this.y, other.x, other.y);
        if (other !== this && distance < this.visionRadius) {
          let relation = this.isFriendOrFoe(other);
          if (relation === "food") {
            if (distance < this.eatingDistance) {
              entities.splice(i, 1); // Eat the entity
              if (random() < this.childChance) {
                entities.push(new Entity(this.x, this.y, this.tribe, this.visionRadius, this.speed));
                // console.log('Child Created of ' + this.tribe);
              }
              
              if (other.tribe == "rock") {RockdeathSound.play();}
              else if (other.tribe == "scissors") {ScissorsdeathSound.play();}
              else if ((other.tribe == "paper")) {PaperdeathSound.play();}

            } else if (distance < nearestDist) {
              nearestPrey = other;
              nearestDist = distance;
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
    }
  
    // Draw the entity
    draw() {
      // Draw the appropriate image based on the tribe
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