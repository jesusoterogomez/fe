'use strict';

var currency = '&euro;';

// Room Table Selectors
var table     = $(".rooms_table_form");
var rows      = $(table).find('tbody tr.one_room');
var cols      = $(table).find('thead > tr > th.sort');
var subtotal  = $(table).find('.summary_subtotal');
var quantity  = $(table).find('.summary_quantity');
var roomQty   = $(rows).find('select[name^="room"]');
var roomPrice = $(rows).find('.room_price');

// CSS Classes referenced in js
var classes = { asc: 'asc', desc: 'desc', active: 'active'};

/* Room Quantity Change */
roomQty.change(function (event) {
  event.preventDefault();

  var count = 0;
  var total = 0;

  // Iterate over each row calculating the subtotals.
  $.each(roomQty, function (index, val) {
    total += parseInt(val.value, 10) * roomPrice.eq(index).html();
    count += parseInt(val.value, 10); // radix = 10 for decimal values - http://jslinterrors.com/missing-radix-parameter
  });

  subtotal.html(currency + total.toFixed(2));
  quantity.html(count);
});

/* Table Sorting function */
function tableSort(index) {
  return function (a, b) {
    var valA = $(a).find('td:eq(' + index + ')').html();
    var valB = $(b).find('td:eq(' + index + ')').html();
    // check if values are numeric
    if ($.isNumeric(valA) && $.isNumeric(valB)) {
      return valA - valB;
    }
    // if not numeric, do string sorting
    return valA > valB ? 1 : -1;
  };
}

/* Table Header Click */
cols.click(function (event) {
  event.preventDefault();

  var tbody = rows.parent();
  var index = cols.index($(this)); // Index of clicked column
  var rowsArray = rows.toArray();

  rowsArray.sort(tableSort(index)); // sort by column

  $(rows).detach(); // Remove row collection

  if (!$(this).hasClass(classes.asc)) {
    tbody.append(rowsArray); // append sorted rows 
    $(cols).removeClass(classes.asc + ' ' + classes.desc); // reset other columns' sorting
    $(this).addClass(classes.asc).removeClass(classes.desc);
  } else {
    tbody.append(rowsArray.reverse()); // append reversed rows
    $(this).addClass(classes.desc).removeClass(classes.asc);
  }
});


/////////////
// Reviews //
/////////////

// variables 
var firstPage     = 1;
var pageItems     = 5;
var reviewList    = $('.reviews_list');
var reviews       = '.one_review';
var pageCount     = Math.ceil($(reviews).length / pageItems);
var pagination    = '.reviews_pagination';
var pagerButton   = '.pager_button';
var reviewScore   = '.review_score';
var reviewSort    = '.reviews_sort';
var pagerTemplate = '<a href="#" class="pager_button"></a>';

// Create the pagination buttons according to button template.
function createPagingButtons(pageCount) {
  var i; // avoid var declaration on each iteration
  for (i = 0; i < pageCount; i++) {
    $(pagination).append($(pagerTemplate).html(i + 1));
  }
}

// Request page by number programatically.
function getPage(pageNumber) {
  $(reviews).hide();
  $(pagination).find(pagerButton).removeClass(classes.active);
  $(pagination).find(pagerButton).eq(pageNumber - 1).addClass(classes.active);
  $.each($(reviews), function (n) {
    if (n >= (pageNumber - 1) * pageItems && n < pageNumber * pageItems) {
      $(this).show();
    }
  });
}

// Wrapper function - checks if pagination is needed depending on list/page size.
function paginateReviews(pageNumber, pageCount) {
  if (pageCount > 1) {
    createPagingButtons(pageCount); // start paging at 1
  }
  getPage(pageNumber);
}

// Review sorting function
function sortReviews(a, b) {
  var valA = $(a).find(reviewScore).html();
  var valB = $(b).find(reviewScore).html();
  return valA - valB;
}

paginateReviews(firstPage, pageCount); // Initial Review Pagination

/* Sort Reviews Dropdown Change */
$(reviewSort).change(function (event) {
  event.preventDefault();
  // Create an array from the reviews and sort it numerically by rating
  var reviewsArray = $(reviews).toArray();
  reviewsArray.sort(sortReviews);
  // reset the reviews' visibility and detach the rows from the list.
  $(reviews).show().detach();

  // Check whether to sort asc or desc. 
  if ($(this).val() === classes.asc) {
    reviewList.append(reviewsArray);
  } else {
    reviewList.append(reviewsArray.reverse());
  }
  // Request/navigate to the first page of the reviews after sorting.
  getPage(firstPage);
});


/* Change pages event */
$(pagination).on('click', pagerButton, function (event) {
  event.preventDefault();
  getPage($(this).html());
});

////////////////////
// Similar Hotels //
////////////////////

// Variables
var json = 'similar-hotels.json';
var img_dir = 'img/';
var star = '★';

// Selectors
var similarHotelList = '.similar_hotels_list';

// CSS Classes
var similarHotel = 'similar_hotel';
var hotelName    = 'hotel_name';
var hotelAddress = 'hotel_address';
var hotelThumb   = 'hotel_thumb';
var ratingStars  = 'stars';

// String Repeating function - Inspired by http://stackoverflow.com/questions/202605/repeat-string-javascript 
function repeat(num) {
  return [](+num).join(this);
}

// Build a list of similar hotels from an ajax-loaded json.
$.getJSON(json, function (data) {
  var hotels = [];
  $.each(data, function (index, hotel) {
    // For each hotel in the json file. fill an HTML template.
    hotels.push('<li class="' + similarHotel + '"><a href="#" target="_blank">' +
      '<h3 class="' + hotelName + '">' + hotel.name + '</h3>' +
      '<img class="' + hotelThumb + '" src="' + img_dir + hotel.thumb + '"/>' +
      '<p class="' + ratingStars + '">' + star.repeat(hotel.rating) + '</p>' +
      '<address class="' + hotelAddress + '">' + hotel.address + '</address></a></li>');
  });
  // Append the combined Array of hotels to the list. 
  $(similarHotelList).append(hotels.join(''));
});