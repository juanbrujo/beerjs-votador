$( function() {
  localStorage.debug = 'socket.io-client:socket';

  function toArray(obj) {
    var array = [];
    for (var i = obj.length >>> 0; i--;) { 
      array[i] = obj[i];
    }
    return array;
  }

  var visitors = $('#visitors').epoch( {
    type: 'time.area', axes: ['left', 'bottom', 'right'],
    data: [ { values: [ { time: Date.now()/1000, y: 0 } ] } ]
  });
  var pieData = [
      { label: 'Opcion 1', value: 1 },
      { label: 'Opcion 2', value: 1 },
      { label: 'Opcion 3', value: 1 }
  ];
  var conteo = $('#conteoVotos');
  var pages = $( '#pages' ).epoch( { type: 'bar' } );
  var votos = $( '#votos' ).epoch( { type: 'pie' } );

  var dashboard = io( 'localhost:3000/dashboard' );
  //var dashboard = io.connect(window.location.hostname);

  dashboard.on( 'stats-updated', function( update ) {

    pieData = [
      { label: 'Opcion 1', value: update.opcion1 },
      { label: 'Opcion 2', value: update.opcion2 },
      { label: 'Opcion 3', value: update.opcion3 }
    ]
    console.log(toArray(pieData))
    conteo.html( toArray(pieData) );
    votos.update( pieData );

    var conteoVotos = [];
    for (var i = pieData.length >>> 0; i--;) { 
      conteoVotos[i] = pieData[i].label + ": " + pieData[i].value + " | ";
    }
    conteo.html( conteoVotos );

    var pagesData = [];
    for( var url in update.pages ) {
      pagesData.push( { x: url, y: update.pages[ url ] } );
    }
    pages.update( [ { values: pagesData } ] );

    visitors.push( [ { time: Date.now()/1000, y: update.connections } ] );


  } );

} );
