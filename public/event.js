var i=1;
const slides = $(".slide-container div");
const numberOfSlides = slides.length;
  show(i);
document.addEventListener("keydown", function(e){
  if(e.keyCode==39){
    i++;
    if(i>numberOfSlides)
    i=1;
    show(i);
  }
  else if(e.keyCode==37){
    i--;
    if(i==0)
    i=numberOfSlides;
    show(i);
  }
});
$("#next").click(function(){
  i++;
  if(i>numberOfSlides)
  i=1;
  show(i);
});
$("#prev").click(function(){
  i--;
  if(i==0)
  i=numberOfSlides;
  show(i);
});

function show(n){
  slides.each(function(e){
    slides[e].style.display = "none";
  });
  console.log(slides[n-1]);
  slides[n-1].style.display = "block";
}
