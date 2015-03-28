var currency = '&euro;';

// Classes
var roomQty    = 'select[name^="room"]';
var roomPrice  = '.room_price';

// Room Table Selectors
var table    = $(".rooms_table_form");
var rows     = $(table).find('tbody tr.one_room');
var cols     = $(table).find('thead > tr > th.sort');
var subtotal = $(table).find('.summary_subtotal');
var quantity = $(table).find('.summary_quantity');

// Data Objects
var price = {label:'price'};
var sort  = {asc : 'asc', desc : 'desc'}; 

/* Event on room quantity change */
$(table).on('change', roomQty, function (e) {
	e.preventDefault();
	var count = 0;
	var total = 0;

	$.each(rows.find(roomQty), function(index, val) {
		total = total + parseInt(val.value) * $(val).data(price.label);
		count = count + parseInt(val.value);
	});

	subtotal.html(currency+total.toFixed(2));
	quantity.html(count);
});

/* Event on table header click */
cols.click(function (e) {
	e.preventDefault();
	var tbody = rows.parent();
	var index = cols.index($(this)); // Index of clicked column
	var rowsArray = rows.toArray(); 

	rowsArray.sort(tableSort(index)); // sort by column

	$(rows).detach(); // Remove row collection

	if( ! $(this).hasClass(sort.asc) ){
		tbody.append(rowsArray); // append sorted rows 
		$(cols).removeClass(sort.asc+' '+sort.desc); // reset other columns' sorting
		$(this).addClass(sort.asc).removeClass(sort.desc);
	}
	else{
		tbody.append(rowsArray.reverse()); // append reversed rows
		$(this).addClass(sort.desc).removeClass(sort.asc);
	}
});

/* Sorting function */
function tableSort (index) {
	return function (a,b){
		var valA = $(a).find('td:eq('+index+')').html();
		var	valB = $(b).find('td:eq('+index+')').html();
		//Check whether to sort by number or string and apply sorting
		if($.isNumeric(valA) && $.isNumeric(valB)){	
			return valA - valB;
		}
		else{
			return valA > valB ? 1 : -1;
		}
		return 0;
	}
}