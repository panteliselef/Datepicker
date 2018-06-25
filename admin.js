(function () {
var database = firebase.database();
var fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var datepicker = $("#datepicker");
var datepicker2 = $("#datepicker2");
var dbRf = database.ref("/2018");


for(i = 0; i < fullMonths.length; i++){

  datepicker.append("<div class='test time'>" + fullMonths[i] + "<div class='md'></div></div>")
}

$(".test").on('click', function() {
  month = $(this).text();
  dbRf.once("value",function(snapshot) {
    if(snapshot.hasChild(month)) {
      console.log(snapshot.child(month).numChildren());
      snapshot.child(month).forEach(function(data) {
        datepicker2.append("<div class='test'><div class='day'>" + data.val().date + " " + data.val().day + "</div>" + data.val().time+ "</div>");
      });
    }else {
      $(".warning").css('display','block');
    }
  });
})

}());
