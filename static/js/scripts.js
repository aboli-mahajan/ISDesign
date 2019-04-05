function myFunction(x) {
  var elements = document.getElementsByClassName('apartmentsImg');
  if (x.matches) { // If media query matches
    for(var i=0;i<elements.length;i++){
      elements[i].style.width="100%";
    }
  } else {
    for(var i=0;i<elements.length;i++){
      elements[i].style.width="30vw";

    }
  }
}

var x = window.matchMedia("(max-width: 480px)")
 // Call listener function at run time
x.addEventListener('load', myFunction)
x.addEventListener('change', myFunction)
myFunction(x)