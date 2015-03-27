
// Room Selection Summary
var table = $(".rooms_table_form");
var rooms = $(table).find('select[name^="room"]');
var rows  = $(table).find('tbody tr.one_room');
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
	var index = cols.index($(this)); // Index of clicked column
	var rowsArray = rows.toArray(); 

	$(rows).detach(); // Remove row collection
	rowsArray.sort(tableSort(index)); 


	$(cols).removeClass('sort');
	$(this).addClass('sort');
	// console.log(this);
	tbody.append(rowsArray); // Append sorted row collection
});

function tableSort (index) {
	return function (a,b){
		var valA = $(a).find('td:eq('+index+')').html();
		var	valB = $(b).find('td:eq('+index+')').html();

		//Check whether to sort by number or string
		if($.isNumeric(valA) && $.isNumeric(valB))
		{	
			return valA - valB;
		}
		else
		{
			return valA > valB ? 1 : -1;
			// if (valA > valB){return  1;}
			// else if (valA < valB){return -1;}
			// return 0;	
		}
		return 0;

	}
}
