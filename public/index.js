

const ham = $(".ham");
var numClick = 0;
ham.click(function() {
  if (numClick == 0) {
    numClick = 1;
    $(".ham #handle").removeClass("rotate-right");
    $(".ham #handle").addClass("rotate-left");
    $(".nav-container").removeClass("slide-up");
    $(".nav-container").addClass("slide-down");
  } else {
    numClick = 0;
    $(".ham #handle").removeClass("rotate-left");
    $(".ham #handle").addClass("rotate-right");
    $(".nav-container").removeClass("slide-down");
    $(".nav-container").addClass("slide-up");
  }
});

  const cursor = $(".cursor");
  $(document).mousemove(function(e){
    cursor.attr("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;");
  });

  $(document).click(function() {
    cursor.addClass("curse-click");
    setTimeout(() => {
      cursor.removeClass("curse-click");
    },500);
  });

  $(window).on("load",function(){
    $(".loader").fadeOut("slow");
  });
