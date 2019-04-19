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


$('#apartmentsFilter').submit(function(e) {
  e.preventDefault();
  var formFilter = $(this);
  var submitButton = $('input[type=submit]', formFilter);

  $.ajax({
    type: 'POST',
    url: formFilter.prop('action'),
    accept: {
      javascript: 'application/javascript'
    },
    data: formFilter.serializeArray(),
    beforeSend: function() {
      submitButton.prop('disabled','disabled')
    },
    success: function(response) {
      const jsonData = JSON.parse(response);
      var apDiv = document.getElementById('apartmentList');
      apDiv.innerHTML="";
      for(ap_index in jsonData) {
        apDiv.appendChild(get_card(jsonData[ap_index]))
      }

      myFunction(x)
    }
  }).done(function(data) {
    submitButton.prop('disabled',false)
  });
});


function get_card(data) {
  let outerDiv = document.createElement('div');
  outerDiv.classList.add("card", "flex-row", "flex-wrap", "d-flex", "align-items-stretch");
  outerDiv.style.cssText = "margin: 20px 10px 10px 10px;";
  let cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  cardHeader.style.cssText = "margin-left: 15px; margin-right: 15px;";


  let img = document.createElement('img');
  img.style.cssText = "object-fit: cover; height: 30vh;";
  img.src = data['image_name'];
  img.classList.add('apartmentsImg');
  cardHeader.appendChild(img);

  let cardBody = document.createElement('div');
  cardBody.classList.add("card-body", "px-2");
  cardBody.style.cssText = "width: 50%;";

  let heading = document.createElement('h4');
  heading.classList.add('card-title');
  heading.innerText = data['title'];

  let para = document.createElement('p');
  para.classList.add('card-text','text-left');
  para.innerText = "A " + data['bedrooms'] + " bedroom apartment in the the city of " + data['city'] +
      " Approximate price range is between " + data['price_range'];

  cardBody.appendChild(heading);
  cardBody.appendChild(para);

  outerDiv.appendChild(cardHeader);
  outerDiv.appendChild(cardBody);
  return outerDiv
}


function submitApartmentForm(){
  $('#apartmentForm').submit();
}


function foo(data) {
  console.log(data)
}