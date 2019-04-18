$( ".btn-edycja-nazwy-grupy" ).click(function(event) {
	$("#panel_grupa_id_"+$(this).attr('data-grupa-id')).html('<form action="druzyna.php?p=2&zmien_nazwe_grupy='+$(this).attr('data-grupa-id')+'" method="post"><div class="input-group"><input type="text" class="form-control" name="grupa_nazwa" value="'+ $(this).attr('data-obecna-nazwa')+'"><span class="input-group-btn"><input class="btn btn-primary" type="submit" value="Ok"/></span></div></form>');
});


/*$( ".zapisz_kolejnosc_atakow" ).click(function(event) {
	event.preventDefault();
	var numer_poka = $(this).attr('data-pokemon-id');
	var zrodlo = $(this).attr('data-zrodlo');
	
	var postData = $( "#sortable-ataki-"+numer_poka ).sortable("serialize");
	
	$("html, body").animate({ scrollTop: 0 }, "fast");
	$.ajax({
		type : 'GET',
		url : 'gra/stan.php?zmiana='+numer_poka+'&zrodlo='+zrodlo+'&zmien_kolejnosc_atakow',           
		data: {
			postData : postData
		},
		success:function (data) {
			$( "#glowne_okno" ).html( data );
		}   
	}); 
});

$( ".zapisz_kolejnosc_balli" ).click(function(event) {
	event.preventDefault();
	
	$("html, body").animate({ scrollTop: 0 }, "slow");
	
	var postData = $( "#sortable-balle" ).sortable( "serialize")+'&'+$('.wyswietlaj_balla').serialize();
	
	$("html, body").animate({ scrollTop: 0 }, "fast");
	$.ajax({
		type : 'GET',
		url : 'gra/konto.php?zmien_kolejnosc_atakow',           
		data: {
			postData : postData
		},
		success:function (data) {
			$( "#glowne_okno" ).html( data );
		}          
	}); 
}); */

$( ".nauka-ataku" ).click(function(event) {
	event.preventDefault();
	
	$("html, body").animate({ scrollTop: 0 }, "slow");
	
	var naucz_zamiast = $("input[name=nauczZamiast-"+$(this).attr("data-pokemon-id")+"]:checked").val();
	
	//$("#glowne_okno").html('Wczytywanie...');
	if ($(this).attr("data-tm-zapomniany")) {	
		$.get( 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&tm_zapomniany='+$(this).attr("data-tm-zapomniany")+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'), function( data ) { $( "#glowne_okno" ).html( data ); });
	} else if ($(this).attr("data-tm")) {
		$.get( 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&tm='+$(this).attr("data-tm")+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'), function( data ) { $( "#glowne_okno" ).html( data ); });
	} else {
		$.get( 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&nauka_ataku='+$(this).attr('data-nazwa-ataku')+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'), function( data ) { $( "#glowne_okno" ).html( data ); });
	}
});

$(".select-submit").one("blur change", function(e){ 
	e.preventDefault();
	$("html, body").animate({ scrollTop: 0 }, "slow");
	
	//Obejście modali
		$('body').removeClass('modal-open');
		$('body').css({"padding-right":"0px"});
		$('.modal-backdrop').remove();
	
    var postData = $(this).closest('form').serializeArray();
	
	$("html, body").animate({ scrollTop: 0 }, "fast");
	
	$.ajax({
		type : 'GET',
		url : 'gra/'+$(this).closest('form').attr('action'),           
		data: {
			postData : postData
		},
		success:function (data) {
			$( "#glowne_okno" ).html( data );
		}          
	}); 
});

$('#zatwierdz_reprezentacje').click(function (e) {
	$("html, body").animate({ scrollTop: 0 }, "slow");
	
	//Obejście modali
		$('body').removeClass('modal-open');
		$('body').css({"padding-right":"0px"});
		$('.modal-backdrop').remove();
	
    var postData = $(this).closest('form').serializeArray();
	
	$("html, body").animate({ scrollTop: 0 }, "fast");
	$.ajax({
		type : 'GET',
		url : 'gra/'+$(this).closest('form').attr('action'),           
		data: {
			postData : postData
		},
		success:function (data) {
			$( "#glowne_okno" ).html( data );
		}          
	}); 
	
	e.preventDefault();
});

$('.collapse_toggle_icon').click(function (e) {
	if($( ".collapse_toggle_icon" ).hasClass( "glyphicon-chevron-down" )) {
		$( ".collapse_toggle_icon").removeClass( "glyphicon-chevron-down" ).addClass( "glyphicon-chevron-up" );
	} else {
		$( ".collapse_toggle_icon").removeClass( "glyphicon-chevron-up" ).addClass( "glyphicon-chevron-down" );	
	}
});
