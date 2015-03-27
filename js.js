
// Room Selection Summary
var table = $(".rooms_table_form");
var rooms = $(table).find('select[name^="room"]');
var rows  = $(table).find('tbody .one_room');
var cols  = $(table).find('thead > tr > th');

rooms.change(function (e) {
	e.preventDefault();
	var count = 0,
		total = 0;

	$.each(rooms, function(index, val) {
		total = total + parseInt(val.value) * $(this).data('price');
		count = count + parseInt(val.value);
	});

	$('.reservation_total').html('&euro;'+total.toFixed(2));
	$('.reservation_quantity').html(count);
});

cols.on('click', function (e) {
	e.preventDefault();
	var tbody = rows.parent();
	var index = cols.index($(this)); // Index of Clicked Column

	var colArray = rows.toArray(); // Rows of Clicked Column

	$(rows).detach(); //remove row collection
	colArray.sort(tableSort(index)); // apply sorting
	
	tbody.append(colArray); //append sorted row collection
});

function tableSort (index) {
	return function (a,b){
		var valA = $(a).find('td:eq('+index+')').html();
		var	valB = $(b).find('td:eq('+index+')').html();

		if (valA > valB){
			return 1;
		}
		if (valA < valB){
			return -1;
		}
		return 0;
	}
}
