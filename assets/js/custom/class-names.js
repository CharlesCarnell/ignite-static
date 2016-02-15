
$(document).ready(function(){
	var arrId = [];	
	var arrClass = [];

		arrId = $('*').map(function(i,e) {
	    	return '#' + $(e).attr('id');
		});

		arrId = $.unique(arrId);
		arrId.sort().get();
		console.log(arrId);


		arrClass = $('*').map(function(i,e) {
	    	return '.' + $(e).attr('class');
		});

		arrClass = $.unique(arrClass);
		arrClass.sort().get();
		console.log(arrClass);
});


