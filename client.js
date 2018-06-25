(function () {
var database = firebase.database();
var datepicker_content, timepicker_content;
days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
fullDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
datepicker = $("#datepicker");
timepicker = $("#timepicker");
btnSubmit = $("#btnSubmit");
today = new Date();
console.log(today);
dbRfYear = database.ref("2018");
dbRfMonth = database.ref(today.getFullYear() + '/' +fullMonths[today.getMonth()]);
console.log(today.getFullYear() + '/' +fullMonths[today.getMonth()]);
// today.setDate(today.getDate());
startingDay = today.getDay();
console.log(fullDays[startingDay]);
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


dbRfYear.once("value",function(snapshot) {
  for(var d = new Date (today); d <= new Date(year,startingMonth,startingDate); d.setDate(d.getDate() +1)){
    a = new Date (d);
    datepicker_content = "<div class='test'><div class='day'>" + days[d.getDay()] + "</div><span>" + d.getDate() + "</span></div>";
    if(a.getDay() != 0 && a.getDay() != 1) {
      datepicker.append(datepicker_content);
    }
  }
});


/* ON CLICK */
datepicker.on('click', '.test' ,function() {
  timepicker.empty();
  $(".test").attr('class','test');
  $(this).addClass('test-selected');
  selDay = $(this).children(".day").text();
  selDate = $(this).children("span").text();
  if(selDate == today.getDate()) {
    currMinutes = today.getMinutes();
    currHour = today.getHours();
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

        id = $(".time:last-child").attr('id');
        idr = id.replace("-",":");
        dbRfMonth.orderByChild('time').equalTo(idr).on("value", function(snapshot) {
          // console.log(snapshot.key);
          snapshot.forEach(function(data) {
            if(d.getDate() == data.val().date) {
              $("#"+id).addClass("disabled");
            }
          });
        });
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

      id = $(".time:last-child").attr('id');
      idr = id.replace("-",":");
      dbRfMonth.orderByChild('time').equalTo(idr).on("value", function(snapshot) {
        snapshot.forEach(function(data) {
          if(d.getDate() == data.val().date) {
            $("#"+id).addClass("disabled");
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




dbRfMonth.on('child_added',function(snapshot) {
  id=snapshot.val().time;
  id = id.replace(":","-");
  $("#"+id).css("color","red");
});

btnSubmit.on('click', function() {
  dbRfMonth.push({
    "time":selTime,
    "day":selDay,
    "date":selDate,
    "month":today.getMonth()+1,
    "year":today.getFullYear(),
    "timestamp":firebase.database.ServerValue.TIMESTAMP,
  });
});


}());
