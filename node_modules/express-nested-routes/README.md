Simple quick routing helper for express
=======================================

```javascript

var server = express();
var nestedRoutes = require('express-nested-routes');

nestedRoutes( server, {
    'GET /': function( req, res ) {
        //...
    },
    'foo': {
        'PUT,POST /bar': function( req, res ) {
            //...
        }
    }
})

//or

nestedRoutes( server, './routes' ) // For loading routes dir tree
// Routes are loaded from directory './routes'
// routes/
//   index.js
//   get.js
//   foo/
//      index.js
//      bar.js

// routes/index.js
module.exports = {
    'GET /': require('./get'),
    'foo': require('./foo')
}
// routes/get.js
module.exports = function( req, res ) {
    // get implementation
};

// ...

```

