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
      cnt = 0;
      for(ap_index in jsonData) {
        apDiv.appendChild(get_card(jsonData[ap_index], cnt));
        cnt++;
      }

      myFunction(x)
    }
  }).done(function(data) {
    submitButton.prop('disabled',false)
  });
});


function get_card(data, cnt) {
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

  let button = document.createElement('button');
  button.classList.add('btn', 'btn-light', 'ml-auto', 'likebtn');
  button.id = 'btn'+cnt;
  button.onclick = function() { likeApartment(data,cnt) };
  button.innerText = 'Like ';

  let icon = document.createElement('i');
  icon.classList.add('fa','fa-thumbs-up');

  button.appendChild(icon);

  cardBody.appendChild(heading);
  cardBody.appendChild(para);
  cardBody.appendChild(button);

  outerDiv.appendChild(cardHeader);
  outerDiv.appendChild(cardBody);
  return outerDiv
}


function submitApartmentForm(){
  $('#apartmentForm').submit();
}


function modal_display(data) {
  console.log(data);
  var apDiv = document.getElementById('apartmentModalBody');
  apDiv.innerHTML="";
  apDiv.classList.add('mx-0');
  if(data != "")
    apDiv.appendChild(createModal(data));
  var modalDiv = document.getElementById('apartmentDetailsModal');
  modalDiv.style.display = 'block';
  var body = document.getElementById('mainBody');
  body.style.overflow = "hidden";
}


function createModal(data){
  let outerDiv = document.createElement('div');
  outerDiv.classList.add("modal-body", "mx-0");
  // outerDiv.style.height = "100%";
  // outerDiv.style.position = "fixed";
  outerDiv.style.overflowY = "scroll";

  let titleDiv = document.createElement('div');
  let titleH = document.createElement('h6');
  titleH.innerText = 'Title';

  let titleP = document.createElement('p');
  titleP.innerText = data['title'];

  let cityDiv = document.createElement('div');
  let cityH = document.createElement('h6');
  cityH.innerText = 'City';

  let cityP = document.createElement('p');
  cityP.innerText = data['city'];

  let priceDiv = document.createElement('div');
  let priceH = document.createElement('h6');
  priceH.innerText = 'Price Range';

  let priceP = document.createElement('p');
  priceP.innerText = data['price_range'];

  let bedroomDiv = document.createElement('div');
  let bedroomH = document.createElement('h6');
  bedroomH.innerText = 'Number of Bedrooms';

  let bedroomP = document.createElement('p');
  bedroomP.innerText = data['bedrooms'];

  let furnishedDiv = document.createElement('div');
  let furnishedH = document.createElement('h6');
  furnishedH.innerText = 'Furnished';

  let furnishedP = document.createElement('p');
  furnishedP.innerText = (data['furnished'] == true) ? 'Yes' : 'No';

  let img = document.createElement('img');
  img.src = data['image_url'];
  // img.style.cssText = "height: 30vh; weight: 100%;";

  titleDiv.appendChild(titleH);
  titleDiv.appendChild((titleP));

  cityDiv.appendChild(cityH);
  cityDiv.appendChild(cityP);

  priceDiv.appendChild(priceH);
  priceDiv.appendChild(priceP);

  bedroomDiv.appendChild(bedroomH);
  bedroomDiv.appendChild(bedroomP);

  furnishedDiv.appendChild(furnishedH);
  furnishedDiv.appendChild(furnishedP);

  outerDiv.appendChild(titleDiv);
  outerDiv.appendChild(cityDiv);
  outerDiv.appendChild(priceDiv);
  outerDiv.appendChild(bedroomDiv);
  outerDiv.appendChild(furnishedDiv);
  outerDiv.appendChild(img);

  return outerDiv;
}


function closeApartmentDetails() {
  var modalDiv = document.getElementById('apartmentDetailsModal');
  modalDiv.style.display = 'none';
  var body = document.getElementById('mainBody');
  body.style.overflow = "scroll";
}


function likeApartment(apartment, i) {
  $.ajax({
    type: 'POST',
    url: 'likeApartment',
    accept: {
      javascript: 'application/javascript'
    },
    data: {'ap_id': apartment['id']},
    success: function(response) {
      var submitButton = document.getElementById('btn'+i);
      submitButton.disabled = true;
    }
  });
}