var express = require( 'express' );
var app = express();

app.use( express.static( __dirname + '/public') );

var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );

// Store data
var stats = {
  connections: 0,
  opcion1: 0,
  opcion2: 0,
  opcion3: 0,
  pages: {}
};

var socketData = {};

var capture = io.of( '/capture' );

capture.on( 'connection', function( socket ) {
  ++stats.connections;

  socket.on( 'client-data', function( data ) {
    socketData[ socket.id ] = data;
    stats.opcion1 += ( data.opcion1? 1 : 0 );
    stats.opcion2 += ( data.opcion2? 1 : 0 );
    stats.opcion3 += ( data.opcion3? 1 : 0 );

    var pageCount = stats.pages[ data.url ] || 0;
    stats.pages[ data.url ] = ++pageCount;

    console.log( stats );
    dashboard.emit( 'stats-updated', stats );
  } );

  socket.on( 'disconnect', function() {
    --stats.connections;

    stats.opcion1 -= ( socketData[ socket.id ].opcion1? 1 : 0 );
    stats.opcion2 -= ( socketData[ socket.id ].opcion2? 1 : 0 );
    stats.opcion3 -= ( socketData[ socket.id ].opcion3? 1 : 0 );
    --stats.pages[ socketData[ socket.id ].url ];
    delete socketData[ socket.id ];

    console.log( stats );
    dashboard.emit( 'stats-updated', stats );
  });

});

var dashboard = io.of( '/dashboard' );
dashboard.on( 'connection', function( socket ) {
  socket.emit( 'stats-updated', stats );
});

var port = process.env.PORT || 3000;
server.listen( port, function(){
  console.log( 'listening on *:' + port );
});