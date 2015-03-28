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

// sort classes
var asc  = 'asc';
var desc = 'desc';

/* Room Quantity Change */
roomQty.change(function (e) {
  e.preventDefault();
  var count = 0;
  var total = 0;

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
cols.click(function (e) {
  e.preventDefault();
  var tbody = rows.parent();
  var index = cols.index($(this)); // Index of clicked column
  var rowsArray = rows.toArray();

  rowsArray.sort(tableSort(index)); // sort by column

  $(rows).detach(); // Remove row collection

  if (!$(this).hasClass(asc)) {
    tbody.append(rowsArray); // append sorted rows 
    $(cols).removeClass(asc + ' ' + desc); // reset other columns' sorting
    $(this).addClass(asc).removeClass(desc);
  } else {
    tbody.append(rowsArray.reverse()); // append reversed rows
    $(this).addClass(desc).removeClass(asc);
  }
});



// Reviews
var firstPage     = 1;
var pageItems     = 5;
var reviewList    = $('.reviews_list');
var reviews       = $(reviewList).find('.one_review');
var pageCount     = Math.ceil(reviews.length / pageItems);
var pagination    = $('.reviews_pagination');
var pagerButton   = '.pager_button';
var pagerTemplate = '<a href="#" class="pager_button"></>';

function createPaging(pageCount) {
  var i;
  for (i = 0; i < pageCount; i++) {
    pagination.append($(pagerTemplate).html(i + 1));
  }
}

function getPage(pageNumber) {
  reviews.hide();
  $(pagination).find(pagerButton).eq(pageNumber - 1).addClass('active');
  $.each(reviews, function (n) {
    if (n >= (pageNumber - 1) * pageItems && n < pageNumber * pageItems) {
      $(this).show();
    }
  });
}

function paginateReviews(pageNumber, pageCount) {
  if (pageCount > 1) {
    createPaging(pageCount); // start paging at 1
  }
  getPage(pageNumber);
}

paginateReviews(firstPage, pageCount); // Paginate Reviews

/* Change pages event */
pagination.on('click', pagerButton, function (event) {
  event.preventDefault();
  $('.pagination a').removeClass('active');
  getPage($(this).html());
});
