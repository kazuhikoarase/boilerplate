
// test entry point

//---------------------------------------------------------------
// load third parties
//---------------------------------------------------------------

window.Vue = require('vue/dist/vue.min.js');
window.jQuery = window.$ = require("jquery");


//---------------------------------------------------------------
// specs
//---------------------------------------------------------------
 
require('./specs/myapp.spec.js');

require('./specs/mypkg.spec.js');

require('./specs/misc.spec.js');
