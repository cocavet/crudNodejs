$(function() {
	$("#fechafin").datepicker();
});

$(document).ready(function(){
	$('select option').each(function(){
		value = $(this).val()
		if(value == #{docs.categoria}){
			$(this).prop('select',true);
		}
	})	
})