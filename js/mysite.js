// A few globals
var theTemp = [];  // Toronto temperature forcast
var isVisible = false; // Fire art description div visible
var fireArtDescription = 2975; // scroll height at which .fire-art-description visibility switches
var headerGraphPadding = 80;
var expEdYearHeight = 40;

// Utility - return data attributes as an array
function dataToArray(selector, dataAttr){

  return $(selector).map(function() {
          return($(this).data(dataAttr));
      }).get();

};

// Translate hourly temperature into svg circles, insert into header
function headerGraph(theTemp){
  // scale x-axis
  var xInc = $( window ).width() / 23;
  var yHeight = $("#temp-graph").height();
  var minTemp = Math.min.apply(Math, theTemp);
  var maxTemp = Math.max.apply(Math, theTemp);
  var yTranslate = 0;
  var padded = headerGraphPadding;

  for (var i = 0; i < 24; i++) {
    yTranslate = (yHeight - 2*padded) / (minTemp - maxTemp) * theTemp[i] + (yHeight - padded) - (yHeight - 2*padded) * minTemp / (minTemp - maxTemp) - padded/2 + 10;
    $('#toronto-temp').append(
      '<circle cx= ' + xInc*i + ' cy= "' + Math.round(yTranslate) + '" r="4" stroke = "black" stroke-width = "2" fill="white"></circle>' );
  }

  $("#temp-graph").html($("#temp-graph").html());
};

$(document).ready(function(){

  // TEMPERATURE CHART IN THE HEADER
  // Header graph - plots 24 temperature forcast in Toronto 
  var apiKey = '846b48e85ccceda590d7c9ccbc6998cd';
  var url = 'https://api.forecast.io/forecast/';
  var lati = 43.7000;
  var longi = -79.4000;
  var data;
  
  $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {

      for (var i = 0; i < 24; i++) {
          theTemp[i] = data.hourly.data[i].apparentTemperature;
      }

      headerGraph(theTemp);

    });

  // DATA VIZ GALLERY
  // Initialize slick gallery in .data-viz section
  $('.gallery').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    initialSlide: 1
  });

  // SMOOTH SCROLL
  // Initialize smooth scrolling navbar
  $('#nav-bar a').smoothScroll({offset: -60});

  // EXPERIENCE AND EDUCATION
  // Takes HTML structured as below, converts into
  // interactive visualization with custom CSS
      // <div class="resume-container">
      //   <div class="col col-year">
      //   </div>
      //   <div class="col col1">
      //     <div class="exp-ed-item" 
      //           data-start="2009" 
      //           data-end="2015"
      //           data-title="PhD Candidate"
      //           data-location="York University">
      //     </div>
      //   </div>
      //   <div class="col col2">
      //     <div class="exp-ed-item" 
      //           data-start="2009" 
      //           data-end="2015"
      //           data-title="PhD Candidate"
      //           data-location="York University">
      //     </div>
      //   </div>
      // </div>

  // Fill in Experience and Education section
  var startDates = dataToArray('.exp-ed-item', 'start');
  var earliestStart = Math.min.apply(Math, startDates);
  var endDates = dataToArray('.exp-ed-item', 'end');
  var latestEnd = Math.max.apply(Math, endDates);

  // Create timeline column
  for (var i = latestEnd; i > earliestStart; i--){
    var yearDiv = $('<div>').addClass('year').addClass('year-'+i).text(i);
    yearDiv.css("top", (latestEnd-i)*expEdYearHeight);
    $('.col-year').append(yearDiv);
  }

  $('.col-year').css('height',expEdYearHeight*(latestEnd - earliestStart));

  $('.exp-ed-item').each( function( index ){
      $(this).addClass('item-' + index);

      var roleDiv = $('<div>').addClass('role').text($(this).data('title'));
      var locationDiv = $('<div>').addClass('location').text($(this).data('location'));
      $(this).append(roleDiv);
      $(this).append(locationDiv);

      var offsetTop = expEdYearHeight * (latestEnd - $(this).data('end'));
      offsetTop = offsetTop;
      $(this).css('top', offsetTop);

      var height = expEdYearHeight * ($(this).data('end') - $(this).data('start')) - 2;
      $(this).css('height', height);

      $(this).hover(function(){
          for (var year = $(this).data('end'); year > $(this).data('start'); year--){
            $('.year-' + year).addClass('year-highlight');
          }
        },
        function(){ 
          for (var year = $(this).data('end'); year > $(this).data('start'); year--){
            $('.year-' + year).removeClass('year-highlight');
          }
        }
      );

  });

});


// Fire art description only appears on page after section appears on screen
$(window).scroll(function(){

    // Fire Art description appears when page is high enough on the screen
     var shouldBeVisible = $(window).scrollTop()>3000;
     if (shouldBeVisible && !isVisible) {
          isVisible = true;
          $( '.fire-art-description' ).animate({
              opacity: 1
            }, 400, function() {
              // Animation complete.
            });
     } else if (isVisible && !shouldBeVisible) {
          isVisible = false;
          $( '.fire-art-description' ).animate({
              opacity: 0
            }, 400, function() {
              // Animation complete.
            });
    }

    // Lock navbar to top of the screen, change opacity

    if ($( window ).width() > 750 & $(window).scrollTop() > 320 ) {
      $('#nav-bar').css('top', '0px');
      $('#nav-bar').css('position', 'fixed');
    } else {
      $('#nav-bar').css('top', '340px');
      $('#nav-bar').css('position', 'absolute');
    }

});

$(window).resize(function(){

  // redraw the header graph on resize if it's on the screen
    $('circle').remove();
    headerGraph(theTemp);

  // nav-bar should be position absolute if the screen is 
  // smaller than 650px

});