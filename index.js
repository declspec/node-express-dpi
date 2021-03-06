"use strict";

var di  = require("node-dpi");

// Register the core components
require("./lib/core")(di);

module.exports = {
    module:	    di.module,
    injector:   di.injector,
    
    bootstrap: function(express, modules, config) {
        if ("object" !== typeof(config))
            config = {};
        
        if (express.injector) 
            throw new Error("Application has already been bootstrapped with this express instance");
        
        modules = modules || [];
        
        // Create a 'value' provider for the express component so we can inject it into other services
        modules.unshift(["$provide", function($provide) {
            $provide.constant("$express", express);
        }]);
        
        // force load the core modules first
        modules.unshift("di");
        
        var injector = express.injector = di.injector(modules, config.strictDi);
        injector.get("$route").resolve();

        return injector;
    }
};