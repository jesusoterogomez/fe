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