
// Room Selection Summary
var rooms = $('.rooms_table_form select[name^="room"]');

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


