(function () {
var database = firebase.database();
var datepicker_content, timepicker_content;
dbRf = database.ref("/appoinment");
days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
fullDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
datepicker = $("#datepicker");
timepicker = $("#timepicker");
btnSubmit = $("#btnSubmit");
today = new Date();
today.setDate(today.getDate());
console.log(today.getDate());
startingDay = today.getDay();
startingDate= today.getDate() + 7;
var selDate;
startingMonth = today.getMonth();
year = today.getFullYear();
datepickerDays = false;
function dataExist() {
  arr = $("#datepicker").children().length;
  if(arr > 0) return true;
  return false;
}



console.log(dbRf);
if(dbRf != null){

  dbRf.once("value",function(snapshot) {


    console.log("NO");

    for(var d = new Date (today); d <= new Date(year,startingMonth,startingDate); d.setDate(d.getDate() +1)){
      a = new Date (d);
      flag = false;

      // snapshot.forEach(function(childSnapshot) {
      //   // key will be "ada" the first time and "alan" the second time
      //   var key = childSnapshot.key;
      //   // childData will be the actual contents of the child
      //   var childData = childSnapshot.val();
      //   dataExist = true;
      //   // receivedData.push(childData.reservedDate);
      //   if(a.getDate() == childData.reservedDate[0] && a.getMonth() == childData.reservedDate[1]){
      //     flag = true;
      //   }
      // });
      if(flag) {

      }else {
        datepicker_content = "<div class='test'><div class='day'>" + days[d.getDay()] + "</div><span>" + d.getDate() + "</span></div>";

      }

      if(a.getDay() != 0 && a.getDay() != 1) {
        datepicker.append(datepicker_content);
        console.log(a.getDay());
      }

    }








    /* ON CLICK */
    datepicker.children(".test").on('click',function() {
      timepicker.empty();
      $(".test").attr('class','test');
      $(this).addClass('test-selected');
      selDay = $(this).children(".day").text();
      selDate = $(this).children("span").text();
      if(selDate == today.getDate()) {
        currMinutes = today.getMinutes();
        currHour = today.getHours();
        console.log("TIME IS:",currHour+":"+currMinutes);
        if(today.getHours() >= 21) {
          timepicker.after("<div class='warning'>we dont have available revervetions after 9PM</div>");
        }
        else {
          for(var d = new Date(today); d <= new Date(d.getFullYear(),d.getMonth(),d.getDate(),20,30); d.setMinutes(d.getMinutes() + 15)) {
            if(d.getMinutes() > 45) {
              timepicker_content = "<div id='" + (d.getHours() + 1) + "-00' class='test time'>" +(d.getHours() + 1) +":00</div>";
            }else if (d.getMinutes() >= 30) {
              timepicker_content = "<div id='" + d.getHours()+ "-45' class='test time'>" +d.getHours()+":45</div>";
            }
            else if (d.getMinutes() >= 15) {
              timepicker_content = "<div id='" + d.getHours() + "-30' class='test time'>" +d.getHours() +":30</div>";
            }
            else if (d.getMinutes() >= 0) {
              timepicker_content = "<div id='" + d.getHours() + "-15' class='test time'>" +d.getHours()+":15</div>";
            }
            timepicker.append(timepicker_content);
          }
        }
      }
      else {
        for(var d = new Date(today.getFullYear(),today.getMonth(),selDate,8,0); d <= new Date(d.getFullYear(),d.getMonth(),d.getDate(),20,30); d.setMinutes(d.getMinutes() + 15)) {

          if(d.getMinutes() >= 45) {
            timepicker_content = "<div id='" + (d.getHours() + 1) + "-00' class='test time ow'>" +(d.getHours() + 1) +":00</div>";
          }else if (d.getMinutes() >= 30) {
            timepicker_content = "<div id='" + d.getHours() + "-45' class='test time ow'>" +d.getHours()+":45</div>";
          }
          else if (d.getMinutes() >= 15) {
            timepicker_content = "<div id='" + d.getHours() + "-30' class='test time ow'>" +d.getHours() +":30</div>";
          }
          else if (d.getMinutes() >= 0) {
            timepicker_content = "<div id='" + d.getHours() + "-15' class='test time ow'>" +d.getHours()+":15</div>";
          }
          timepicker.append(timepicker_content);

          id=$(".time:last-child").attr('id');
          idr= id.replace("-",":");
          dbRf.orderByChild('time').equalTo(idr).on("value", function(snapshot) {
            // console.log(snapshot.key);
            snapshot.forEach(function(data) {
              if(d.getDate() == data.val().date) {
                $("#"+id).addClass("disabled");
                console.log("one",data.val().time);
              }
            });
          });
        }
      }


    });

    $("#timepicker").on('click', '.time' ,function() {
      $("#reservation").removeClass('hidden');
      selTime = $(this).text();
      $("#reservation").text("You made a reservation for " + selDay + ", " + selDate + " at " + selTime);
      $(".time").removeClass('test-selected');
      $(this).addClass('test-selected');
    });



    // $("#datepicker .dropdown").on('click', function() {
    //   console.log($(this).text());
    //   $(".dropdown").children('.dropdown-content').slideUp();
    //   $(".dropdown").css("border-bottom","none");
    //   $(this).children('.dropdown-content').slideToggle();
    //   $(this).css("border-bottom","2px solid #c9c9c9");
    // })
    //
    // $(".dropdown a").on('mouseover',function () {
    //   $(this).css("background-color","#f1f1f1");
    // });
    // $(".dropdown a").hover(function () {
    //   $(this).css("background-color","#f1f1f1");
    // },function() {
    //   $(this).css("background-color","#f9f9f9");
    // });
  });






}

$("#18-00").on('click',function () {
  $(this).css('color',"red");
})

dbRf.on('child_added',function(snapshot) {
  id=snapshot.val().time;
  id = id.replace(":","-");
  $("#"+id).css("color","red");
});

btnSubmit.on('click', function() {
  console.log([selDate,today.getMonth()+1], selTime);
  dbRf.push({
    "time":selTime,
    "day":selDay,
    "date":selDate,
    "month":today.getMonth()+1,
    "year":today.getFullYear(),
    "timestamp":firebase.database.ServerValue.TIMESTAMP,
  });
});


}());
