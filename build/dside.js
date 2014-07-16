var Dside, DsideDipatcher;

DsideDipatcher = (function() {
  var delimiter, routeToMatch, variables;

  routeToMatch = null;

  delimiter = '@';

  variables = [];

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
    routeToMatch = route;
  };

  DsideDipatcher.prototype.getRouteToMatch = function() {
    return routeToMatch;
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
        return route;
      }
    }
    return false;
  };

  DsideDipatcher.prototype.matchDynamicRoute = function(uri, current) {
    var reg;
    uri = uri.replace('/', '\/');
    uri = uri.replace(/{.*?}/, '[a-zA-Z%_\\-0-9\\(\\)]+');
    uri = uri.replace(/'/g, '');
    reg = new RegExp('(' + uri + ')$', 'i');
    if (current.match(reg)) {
      return true;
    }
    return false;
  };

  DsideDipatcher.prototype.dispatchMultipleEvents = function(events) {
    var event, _i, _len;
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      this.dispatch(event);
    }
  };

  DsideDipatcher.prototype.dispatch = function(dispatchEvent, uses) {
    var dis, obj;
    if (uses == null) {
      uses = null;
    }
    if (typeof dispatchEvent === 'function') {
      dispatchEvent();
    } else {
      dis = dispatchEvent.split(delimiter);
      if (dis.length > 1) {
        obj = new window[dis[0]]();
        obj[dis[1]].apply(obj, []);
      } else {
        if (uses !== null) {
          window[uses][dis]();
        } else {
          window[dis]();
        }
      }
    }
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
      if (match.hasOwnProperty('uses')) {
        this.dispatch(match.event, match.uses);
      } else {
        this.dispatch(match.event);
      }
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
