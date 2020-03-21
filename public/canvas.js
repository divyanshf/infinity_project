const canvas = document.querySelector("#canvas");

canvas.width = window.innerWidth - 20;
canvas.height = (window.innerHeight);

var c = canvas.getContext('2d');

var colorArray =[
  "#ebe6e6","#ededed"
];


function Circle(x, y, radius, dx, dy){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.dx= dx;
  this.dy = dy;

  this.draw =function(){
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = colorArray[Math.floor(Math.random()*colorArray.length)];
    c.fillStyle = colorArray[Math.floor(Math.random()*colorArray.length)];
    c.fill();
    c.stroke();
  }

  this.update = function(){
    if (this.x+this.radius > innerWidth-20 || this.x-this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y-this.radius < 0 || this.y+this.radius >innerHeight){
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }

}


var circleArrays = [];

for(var i=0;i<100;i++){
  var radius = 5;
  var x = Math.random() * ((innerWidth-20)-(radius*2)) + radius ;
  var y = Math.random() * ((innerHeight) -(radius*2)) + radius;
  var dx = (Math.random() - 0.5);
  var dy = (Math.random() - 0.5);

  circleArrays.push(new Circle(x, y, radius, dx, dy));
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for(var i=0;i<circleArrays.length;i++){
    circleArrays[i].update();
  }
}

animate();

// for(var i=0;i<50;i++){
//   circleCreater();
// }
