Rock Paper Scissors Simulation README

This project contains a simulation of the game rock-paper-scissors implemented in p5.js, a JavaScript library with a full set of drawing functionality. The simulation features entities of three different types: rock, paper, and scissors.
Files

    README.md: This file.
    index.html: The main HTML file. This file contains the layout of the application, which is a canvas where the entities are drawn and a button to toggle the display of the entities' vision.
    entity.js: This file defines the Entity class. Each entity is an instance of this class. The entities have properties such as tribe, speed, and vision radius, and methods for determining friends and foes, moving, checking for collisions and drawing themselves on the canvas.
    sketch.js: This file contains the main p5.js sketch. It initializes the entities and handles the game loop, where it updates and draws each entity on each frame.
    p5.min.js: This is the p5.js library, which is used for rendering the graphics on the canvas.
    p5.sound.js: This is the p5.js sound library, which is used for playing sounds when entities "eat" each other.
    ./pictures/: A folder that contains image files for rock, paper, and scissors.

How it Works

The script creates a number of entities (configured by n_entities) in random locations. Each entity is randomly assigned a type (rock, paper, or scissors). The entities then move around the canvas, interact with each other based on the rules of rock-paper-scissors (rock defeats scissors, scissors defeat paper, paper defeats rock), and reproduce if conditions allow.

The entities will eat an entity that they can defeat if it is within a certain distance (configured by this.eatingDistance). If the entity successfully eats another entity, there is a chance (configured by this.childChance) that it will reproduce and create a new entity of the same type.

An entity will try to move away from an enemy that is within its vision radius. The vision radius is configurable by this.visionRadius. The entity will also try to move towards any food that is within its vision radius.

Entities will try to avoid going off the edge of the canvas. If they are within a certain distance (this.safeDistance) of the edge, they will change direction to move away from the edge.

Each entity will live for a certain amount of time (configured by this.secondsToLive) before it dies.

The simulation displays the current counts of rock, paper, and scissors entities on the screen. If there is only one type of entity left, that type is declared the winner and the game ends.
Getting Started

To run the simulation, you will need to serve it through a local server due to browser restrictions on loading local files. You can use a simple server like http-server in Node.js, or a more complex server like Apache or Nginx.

Once the server is running, open your browser and go to the URL of your local server (often localhost:8000 or localhost:8080), and you should see the simulation running.

You can modify the behavior of the entities by changing the values of the variables in the JavaScript code.
Code Structure

    Preloading of assets: Image assets are preloaded before the p5.js setup function runs.
    Entity Class: Defines the entities' behavior, including movement, interaction with other entities, reproduction, and lifespan.
    Setup function: Initializes the p5.js canvas and creates the initial entities. Also, it adds an event listener to a button that toggles the display of the vision radius for the entities.
    Draw function: Moves and draws the entities, checks for their lifespan, updates the counts of each entity type, and displays the winner (if there is one) for each frame of the p5.js loop.

Interaction

There is a button (with id #toggle-vision) that toggles the visibility of the vision circles for the entities.
Notes

You may wish to adjust the number of entities, their speed, lifespan, vision radius, safe distance, eating distance, child chance, and the chance to change direction to see how it affects the simulation.
