var Dside, DsideDipatcher;

DsideDipatcher = (function() {
  var delimiter, hashDelimiter, queryStringDelimiter, routeToMatch, scope, variables;

  routeToMatch = null;

  delimiter = '@';

  queryStringDelimiter = '?';

  hashDelimiter = '#';

  variables = [];

  scope = window;

  function DsideDipatcher() {
    this.rootURI = null;
    this.currentURI = document.URL;
    this.routes = [];
    this.beforeEvents = [];
    this.afterEvents = [];
  }

  DsideDipatcher.prototype.setRoot = function(uri) {
    this.rootURI = uri;
  };

  DsideDipatcher.prototype.getRoot = function() {
    return this.rootURI;
  };

  DsideDipatcher.prototype.setRouteToMatch = function(route) {
    routeToMatch = this.prepareRoute(route);
  };

  DsideDipatcher.prototype.getRouteToMatch = function() {
    return routeToMatch;
  };

  DsideDipatcher.prototype.setScope = function(scope) {
    scope = scope;
  };

  DsideDipatcher.prototype.getScope = function() {
    return scope;
  };

  DsideDipatcher.prototype.prepareRoute = function(route) {
    return route.split(queryStringDelimiter)[0].split(hashDelimiter)[0];
  };

  DsideDipatcher.prototype.register = function(route) {
    var obj, _i, _len;
    if (route.length > 0 && route[0] instanceof Object) {
      for (_i = 0, _len = route.length; _i < _len; _i++) {
        obj = route[_i];
        this.routes.push(obj);
      }
    } else {
      this.routes.push(route);
    }
  };

  DsideDipatcher.prototype.before = function(event) {
    this.beforeEvents.push(event);
  };

  DsideDipatcher.prototype.after = function(event) {
    this.afterEvents.push(event);
  };

  DsideDipatcher.prototype.matchRoute = function(currentRoute) {
    var route, _i, _len, _ref;
    _ref = this.routes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      if (route.uri === currentRoute) {
        return route;
      } else if (this.matchDynamicRoute(route.uri, currentRoute)) {
        route['paramaters'] = this.resolveParamatersFromRoute(route, currentRoute);
        return route;
      }
    }
    return false;
  };

  DsideDipatcher.prototype.matchDynamicRoute = function(uri, current) {
    var reg;
    uri = uri.replace(/{.*?}/g, '[a-zA-Z%_\\-0-9\\(\\)]+');
    reg = new RegExp('(' + uri + ')$', 'i');
    if (current.match(reg)) {
      return true;
    }
    return false;
  };

  DsideDipatcher.prototype.resolveParamatersFromRoute = function(route, current) {
    var currentStrings, key, params, routeStrings, value;
    params = [];
    routeStrings = route.uri.split('/');
    currentStrings = current.split('/');
    for (key in routeStrings) {
      value = routeStrings[key];
      if (value.match(/{.*?}/)) {
        params.push(this.castStringToInt(currentStrings[key]));
      }
    }
    return params;
  };


  /*
  	 * Helper function, will cast a string to integer if the casted value is a number
  	 * Otherwise will return as a string
  	 *
  	 * @return mixed
   */

  DsideDipatcher.prototype.castStringToInt = function(val) {
    var check;
    check = parseInt(val);
    if (!isNaN(check)) {
      return check;
    }
    return val;
  };

  DsideDipatcher.prototype.dispatchMultipleEvents = function(events) {
    var event, _i, _len;
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      this.dispatch(event);
    }
  };


  /*
  	 * If callback then run it
  	 * Else split the string and check it's length
  	 *
  	 * If length is over 1 element then we check if only the second element is filled
  	 * If it is then we're firing a function, if both are filled we're constructing an object
  	 * and firing a function from that object
  	 *
  	 *
   */

  DsideDipatcher.prototype.dispatch = function(dispatchEvent, paramaters, uses, construct) {
    var dis, obj;
    if (paramaters == null) {
      paramaters = [];
    }
    if (uses == null) {
      uses = null;
    }
    if (construct == null) {
      construct = null;
    }
    if (typeof dispatchEvent === 'function') {
      dispatchEvent();
    } else {
      dis = dispatchEvent.split(delimiter);
      if (dis.length > 1) {
        if (dis[0] === '') {
          window[dis[1]].apply(null, paramaters);
        } else {
          obj = new window[dis[0]]();
          obj[dis[1]].apply(obj, paramaters);
        }
      } else {
        if (uses !== null) {
          window[uses][dis].apply(null, paramaters);
        } else {
          new window[dis](paramaters);
        }
      }
    }
  };

  DsideDipatcher.prototype.constructObject = function(ctor, params) {
    var fakeCtor, newobj, obj;
    fakeCtor = function() {};
    fakeCtor.prototype = ctor.prototype;
    obj = new fakeCtor();
    obj.constructor = ctor;
    console.log(obj);
    newobj = ctor.apply(obj, params);
    if (newobj !== null && (typeof newobj === "object" || typeof newobj === "function")) {
      obj = newobj;
    }
    return obj;
  };


  /*
  	 * Try and match a route, if you do we get the key to the reoute
  	 * The beofre after actions are dispatched, then the main route,
  	 * then the after filters.
  	 *
   */

  DsideDipatcher.prototype.run = function() {
    var match;
    if (this.getRoot() === null) {
      throw new Error('No root URI set');
    }
    this.setRouteToMatch(this.currentURI.replace(this.getRoot(), ''));
    if (match = this.matchRoute(this.getRouteToMatch())) {
      this.dispatchMultipleEvents(this.beforeEvents);
      if (match.hasOwnProperty('before')) {
        this.dispatchMultipleEvents(match.before);
      }
      this.dispatch(match.event, match.paramaters, match.uses, match.construct);
      this.dispatchMultipleEvents(this.afterEvents);
      if (match.hasOwnProperty('after')) {
        this.dispatchMultipleEvents(match.after);
      }
    }
  };


  /*
  	 * Resets Dside to a newly constructed object
  	 * Removes regiestered routes and filters 
  	 *
   */

  DsideDipatcher.prototype.reset = function() {
    window.Dside = null;
    window.Dside = new DsideDipatcher();
  };

  return DsideDipatcher;

})();

Dside = new DsideDipatcher();
