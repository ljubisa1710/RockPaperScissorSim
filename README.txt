# Rock Paper Scissors Simulation README

This project contains a simulation of the game rock-paper-scissors implemented in p5.js, a JavaScript library with a full set of drawing functionality. The simulation features entities of three different types: rock, paper, and scissors.

## Files

The main file is the JavaScript (.js) file that contains the game simulation code.

There is also a subfolder (`./pictures/`) that contains image files for rock, paper, and scissors.

## How it Works

The script creates a number of entities (configured by `n_entities`) in random locations. Each entity is randomly assigned a type (rock, paper, or scissors). The entities then move around the canvas, interact with each other based on the rules of rock-paper-scissors (rock defeats scissors, scissors defeat paper, paper defeats rock), and reproduce if conditions allow.

The entities will eat an entity that they can defeat if it is within a certain distance (configured by `this.eatingDistance`). If the entity successfully eats another entity, there is a chance (configured by `this.childChance`) that it will reproduce and create a new entity of the same type.

An entity will try to move away from an enemy that is within its vision radius. The vision radius is configurable by `this.visionRadius`. The entity will also try to move towards any food that is within its vision radius.

Entities will try to avoid going off the edge of the canvas. If they are within a certain distance (`this.safeDistance`) of the edge, they will change direction to move away from the edge.

Each entity will live for a certain amount of time (configured by `this.secondsToLive`) before it dies.

The simulation displays the current counts of rock, paper, and scissors entities on the screen. If there is only one type of entity left, that type is declared the winner and the game ends.

## Getting Started

To run the simulation, you will need to have p5.js library loaded and the path to your JavaScript file correctly referenced in your HTML. Open the HTML file in a web browser to view the simulation.

You can modify the behavior of the entities by changing the values of the variables in the JavaScript code.

## Code Structure

- **Preloading of assets:** Image assets are preloaded before the p5.js setup function runs.

- **Entity Class:** Defines the entities' behavior, including movement, interaction with other entities, reproduction, and lifespan.

- **Setup function:** Initializes the p5.js canvas and creates the initial entities. Also, it adds an event listener to a button that toggles the display of the vision radius for the entities.

- **Draw function:** Moves and draws the entities, checks for their lifespan, updates the counts of each entity type, and displays the winner (if there is one) for each frame of the p5.js loop.

## Interaction

There is a button (with id `#toggle-vision`) that toggles the visibility of the vision circles for the entities.

## Notes

You may wish to adjust the number of entities, their speed, lifespan, vision radius, safe distance, eating distance, child chance, and the chance to change direction to see how it affects the simulation.