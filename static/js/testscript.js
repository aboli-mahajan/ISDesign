function checkRadio() {
     var gender = '{{ user[\'gender\'] }}'

    if ( gender == "Male" ){
         radiobtn = document.getElementById("male");
         radiobtn.attr('checked','checked');

         }else{
         radiobtn = document.getElementById("female");
         radiobtn.attr('checked','checked');

    }
}

let ready = $(document).ready(function() {

    checkRadio();
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $(".img-profile").show().attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    $(".file-upload").on('change', function(){
        readURL(this);
    });

    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
});