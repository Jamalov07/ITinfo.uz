'use strict';

function loadRouteMap( app, map, ctx ) {
  var k, toks, methods, route;
  for( k in  map ) {
    toks = k.split(/\s+/);
    if( toks.length > 1 ) {
      methods = toks.shift( toks ).toLowerCase().split(',');
    }
    route = ctx.route + '/' + toks.join(' ');
    methods = methods || [ ctx.method ];
    methods.forEach( function( method ) {
      if( map[k] instanceof Array ) {
        var lastItem = map[k].pop();
        var middlewares = (ctx.middlewares || []).concat( map[k] );
        if( typeof lastItem === 'function' ) {
          console.log( 'Register route with middlewares', method, route );
          app[ method ]( route, middlewares.concat([ lastItem ]) );
        }
        else if( typeof lastItem === 'object' ) {
          loadRouteMap( app, lastItem, {
            route: route,
            method: method || ctx.method,
            middlewares: middlewares
          });
        }
        else {
          throw 'Unsupported object type at end of route array';
        }
      }
      else if( typeof map[k] === 'object' ) {
        loadRouteMap( app, map[k], {
          route: route,
          method: method || ctx.method,
          middlewares: ctx.middlewares
        });
      }
      else if( typeof map[k] === 'function' ) {
        console.log( 'Register route', method, route );
        app[ method ]( route, map[k] );
      }
    });
  }
}

module.exports = function( app, dir, route ) {
  loadRouteMap( app, typeof dir === 'string' ? require( dir ) : dir, { 
    route: route || '',
    method: 'all'
  } );
};

