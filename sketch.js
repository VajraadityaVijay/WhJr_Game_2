const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Common = Matter.Common;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const BackgroundColor = "#563b1b";
var world, engine;
var center = { x: 400, y: 400 };

var BigCircle, BigCircleSprite, BigCircleRadius, BigCircleOutline;
var ControlCircle, ControlCircleSprite;
var pointCircles = [];
var obstacles = [];
var lines = [];
var centerCircle;

function setup() {
  createCanvas(800, 600);
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 3.5;

  var options = {
    isStatic: true
  };
  BigCircleRadius = 300;
  BigCircle = Bodies.circle(400, 400, BigCircleRadius, options);
  World.add(world, BigCircle);
  BigCircle.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
  };

  ControlCircle = Bodies.circle(400, 400, 25, { density: 0.02, mass: 5 });
  ControlCircle.setMass = 10;
  World.add(world, ControlCircle);

  centerCircle = Bodies.circle(400, 400, 0.5, { isStatic: true });
  World.add(world, centerCircle);
  centerCircle.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
  };

  rope = Constraint.create({
    bodyA: ControlCircle,
    bodyB: centerCircle,
    stiffness: 2,
    length: BigCircleRadius / 2 - 25
  })
  World.add(world, rope);

  pointCircles[0] = new PointCircle(460, 510);
  pointCircles[1] = new PointCircle(635, 400);
  pointCircles[2] = new PointCircle(-100, 450);
  pointCircles[3] = new PointCircle(400, 50);
  //obstacles[0] = new Obstacle(305, 460, 40)
  lines[0] = new Line({ x: 400, y: 400 }, { x: 400, y: 800 });
}

function draw() {
  background(BackgroundColor);
  Engine.update(engine);
  camera.position.x = ControlCircle.position.x;
  camera.position.y = ControlCircle.position.y;

  handleKeyPress();

  fill("#d89545");
  noStroke();
  circle(BigCircle.position.x, BigCircle.position.y, BigCircleRadius);
  fill("#442f15");
  circle(ControlCircle.position.x, ControlCircle.position.y, 50);

  for (var i = 0; i < pointCircles.length; i++) {
    pointCircles[i].display();
  }
  for (i = 0; i < obstacles.length; i++) {
    obstacles[i].display();
  }

  var circleDist = dist(centerCircle.position.x, centerCircle.position.y, ControlCircle.position.x, ControlCircle.position.y)
  if (circleDist >= BigCircleRadius / 2 - 25) {
    rope.stiffness = 2 / circleDist * 120;
  } else {
    rope.stiffness = 0;
  }

  drawSprites();
}

function handleKeyPress() {
  if (keyIsDown(RIGHT_ARROW)) {
    Body.applyForce(ControlCircle, { x: 0, y: 0 }, { x: 0.015, y: 0 });
  }
  if (keyIsDown(LEFT_ARROW)) {
    Body.applyForce(ControlCircle, { x: 0, y: 0 }, { x: -0.015, y: 0 });
  }
  if (keyIsDown(LEFT_ARROW)) {
    Body.applyForce(ControlCircle, { x: 0, y: 0 }, { x: -0.005, y: 0 });
  }
}

function loadNextSize() {
  BigCircleRadius += 300;
  rope.length += 150;
}