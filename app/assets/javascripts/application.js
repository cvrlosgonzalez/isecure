// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require_tree .

//= require bootstrap

function parseBool(val) { return val === true || val === "true" }

function confirmation(text){
    resp = window.confirm(text);
    return resp;
  }

function toggle_power(option){  //turn camera on or off
  console.log('in toggle_power: options is => ' + option);
  $.ajax({
      url: "/monitorfire/2/?power="+option
        })
};


$( document ).ready(function() {
// toggle defaults
// $('#alerts').css("display", "none");
$('#texting').css("display", "block");

//section to save alerts
    $('.monitor_toggle').on("click", function(){
      console.log("click works");
      var monId = $(this).attr('id');
      var monVal = $(this).attr('value')
      var cam_id = $("#cam_id_").attr('value')
    $.ajax({
        url: "/monitor_" + monVal + "/" + cam_id
    })
      .done(function() {
console.log('monVal is::::' + monVal);
        $('#monitor_status').text("The monitor is set to: " + monVal.toUpperCase());
        $('#monitor_status').css("display", "block");
        $('#monitor_' + monVal).css("selected", "selected")
        if (monVal == 'on') {
          $('#texting').css("display", "block");
        } else {
          $('#texting').css("display", "none");
        }
      })
    });

// turn power off and on
    $('.cams_power').on("click", function(){
      var camspower = $(this).attr('value');
      var option = parseBool(camspower) //turn string true/false into bool true/false
      console.info('power option selected is: ' + option);
      if(option){ user_option = "ON" } else { user_option = "OFF"};
      console.log('after IF statement, user_option is ' + user_option);

      if(user_option == "ON"){
        var ref = new Firebase('wss://developer-api.nest.com');
        toggle_power(option);

      } else if (user_option == "OFF") {
        var ref = new Firebase('wss://developer-api.nest.com');
        toggle_power(option);

      } else {
        $('#cam_status').text("No changes have been made to the camera's power status. ", "block");

        //insert firebase call to get real camera status
        // $('#cam_status').append("\nCamera status is: " + user_option);
        // $('#cam_status').css("display", "block");
      };
    })

// toggle text alerts
      $('.text_alert_toggle').on("click", function(){
          var text_option = $(this).attr('value');
          var cam_id = $("#cam_id_").attr('value')
          console.log('cam_id ' + cam_id);
          console.log('text_option ' + text_option);
          var text_bool = parseBool(text_option) //turn string true/false into bool true/false

          if(text_bool){ text_alerts_option = "on" } else { text_alerts_option = "off"};

          $.ajax({
              url: "/textfire_" + text_option + "/" + cam_id
          })
            .done(function() {
      console.log('monVal is::::' + monVal);
              $('#monitor_status').text("The monitor is set to: " + monVal.toUpperCase());
              $('#monitor_status').css("display", "block");
              $('#monitor_' + monVal).css("selected", "selected")
              if (monVal == 'on') {
                $('#texting').css("display", "block");
              } else {
                $('#texting').css("display", "none");
              }
            })


       });


// PHOTOS TO DISPLAY WHEN ALERTS ARE ON
// toggle animated_url which is hidden below thumbnail image
    $('.alert_photos').on("click", function() {
       var id_num = $(this).closest('div').attr('id');
        $('#' + id_num +'_imageholder').toggle();
        $('#' + id_num ).toggle();
    });
// toggle animated_url which is hidden below thumbnail image
    $('.animated_display').on("click", function() {
      //  var id_num = $(this).closest('div').attr('id');
       var id_num = $(this).prev().attr('id');
        $('#' + id_num +'_imageholder').toggle();
        $('#' + id_num ).toggle();

    });


    // get latest alert without screen refresh. either alert user to refresh or update page with prepend.

    function checkForNewAlerts(){
      var ref = new Firebase("https://blistering-heat-6382.firebaseio.com/alerts/");
      ref.on ("child_changed", function(snapshot) {
        var resp = snapshot.val();
          $( '<img src="'+ resp.image_url + '" class="alert_photos"> <br><br>' ).prependTo( '#alerts_container' );
          $( '<p>A new image is available. Refresh page to view details</p>' ).prependTo( '#alerts_container' );
          $('.refresh_btn').css("display", "block");
          $('.refresh_btn').css("color", "red");
          console.log('new alert! : '+ resp.last_alert);
          // ref.remove(); //can remove it, but since this data is in 'alerts' branch, no need to.
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
      };
      checkForNewAlerts();


// get Firebase status to update screen whenever a change is made.
// changes to Firebase are triggered by turning power OR alerts on/off.
      function checkStatus(){
        var ref2 = new Firebase("https://blistering-heat-6382.firebaseio.com/monitor");
        ref2.on ("child_changed", function(snapshot) {
          var status = snapshot.val();
            // $( '</div id="status_btn">Alerts being saved? ' + status.save_alerts + ' <br><br>' ).prependTo( '#alerts_container' );
            var power = "";
            var powerstatus = (status.power === true) ? power ='ON': power = 'OFF';
            console.log("alerts >: " + alerts);

            console.log("power is >: " + power);
            $('#cam_status').html('<div id="status_btn">Camera\'s Power is ' + power + '</div>');
            $('#cam_status').css("color","white")
            $('#cam_status').css("display", "block");

            if(power == 'ON') {
              $('#cam_status').css("background-color","green");
              $('#monitor_off').css("selected", "selected")
              $('#alerts').css("display","block");

            } else if (power == 'OFF') {
              // $('#cam_status').html('<div id="status_btn">Camera\'s Power is ' + power + '</div>');
              $('#cam_status').css("background-color","red");
              // $('#cam_status').css("color","white")
              // $('#cam_status').css("display", "block");
              $('#alerts').css("display","none");
              $('#texting').css("display", "none");

            }

            var alerts = "";
            var alertstatus = (status.save_alerts == "yes") ? alerts ='ON': alerts = 'OFF';
            console.log("alerts >: " + alerts);
            $('#alert_status').html('<div id="status_btn">Alerts being saved? ' + status.save_alerts.toUpperCase() + '</div>');
            $('#alert_status').css("color","white");
            $('#cam_status').css("display", "block");

            if(alerts == 'ON') {
              $('#alert_status').css("background-color","green  ");
              $('#texting').css("display", "block");

            } else if (alerts == 'OFF'){
              $('#alert_status').css("background-color","red");
            }


            // $('.refresh_btn').css("color", "red");
            console.log('do we save alerts? : '+ status.save_alerts);
            console.log('name is is: '+ status.user);
            console.log('name is is: '+ status.power); // power will be true/false
            // console.log(typeof(status.power));  // confirmed boolean if true, not 'true'
          }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          });
        };
        checkStatus();
});
