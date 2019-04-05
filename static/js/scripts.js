function myFunction(x) {
  var elements = document.getElementsByClassName('apartmentsImg');
  // alert('here');
  if (x.matches) { // If media query matches
    // alert('hey');
    for(var i=0;i<elements.length;i++){
      elements[i].style.width="100%";
    }
    // element.classList.add("card-img-top");
  } else {
    // alert('hi');
    for(var i=0;i<elements.length;i++){
      elements[i].style.width="30vw";
    }
    // element.classList.add("card-img-top");
  }
}

var x = window.matchMedia("(max-width: 480px)")
myFunction(x) // Call listener function at run time
x.addEventListener('change', myFunction) // Attach listener function on state changess