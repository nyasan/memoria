var Eventos = {


	popup_cargar: 	
						
						'<div id="cargarEventos"  style="display:none;"> \
						<form name="datos" action="" method="POST" class="contender" target="_blank">\
						Título: <div > <input type="text" name="titulo" class="Pop-Titulo" id="Pop-Titulo"> </div>\
						<p>Fecha: <br/> <input type="text" id="datepicker"></p>\
						Descripción: <div class="PopDescripcion"> <input type="text" name="descripcion" class="pop-descripcion"><br> </div>\
						Categoría: <br><select id="agregarCategorias" class="agregarCategorias" multiple="multiple" size="5"></select><br>\
						País: <br><select id="agregarPaises" class="agregarPaises" multiple="multiple" size="5"></select><br><br>\
						<input type="submit" value="enviar">    <input type="reset" value="borrar">\
						</form>\
						</div>'
						,

	// Variable que contiene el json con toda la data
	data: null,

	// Método que carga los datos desde el webservice y los asigna a la variable data
	cargarDatos: function () {
		var consulta = $.ajax({
			url: 'http://107.170.16.162:8088/data',
			dataType: 'jsonp',
			jsonpCallback: "dataMemoria",
		});
		
		consulta.done(function (eventos) {
			data = eventos;
			Linea.init();
		});
		
		consulta.fail(function () {
			alert("Se ha producido una error en la carga de datos");
		});	
	},
	

	filtrar: function (fecha_desde, fecha_hasta, ponderacion, filtros) {		
		var query = Enumerable
			.From(data.data)
			.Where(function (x) {
				var fecha = x.fecha.parseDate();
				var rango = x.ponderacion <= ponderacion &&  fecha_desde <= fecha && fecha <= fecha_hasta;
			
				var categorias = filtros.categorias === null || 
				filtros.categorias.filter(function (val) { return val === x.categoria }).length !== 0;
			
				var paises = filtros.paises === null || 
				filtros.paises.filter(function (val) { return val === x.pais }).length !== 0;
							
				return rango && categorias && paises;
			})
			.ToArray();
		return query;
	},


	cargar: function () {

		popup = Eventos.popup_cargar
			
		$('body').append(popup);
		$('#cargarEventos').dialog({ 
			width: 400,
			height: 450,
			resizable: true,
			closeOnEscape: true,
			title: 'Evento Nuevo',
			modal: true,
			close: function( event, ui ) { Eventos.ocultar_popup(); },
			show: { effect: "slideDown", duration: 800 }
			});
		Eventos.calendario();
		Filtros.cargarCombosPopUpEvento();
	},

		ocultar_popup: function () {
		//Elimina el div que contiene el popup
		$('#cargarEventos').remove();		
	},
	
	calendario: function()
	{
		$( "#datepicker" ).datepicker({ dateFormat: 'dd/mm/yy' });
		$.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
	}
	
};
