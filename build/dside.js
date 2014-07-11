var Dside;

Dside = (function() {
  var delimiter, routeToMatch, variables;

  routeToMatch = null;

  delimiter = '@';

  variables = [];

  function Dside() {
    this.rootURI = 'http://localhost/dside/';
    this.currentURI = document.URL;
    this.routes = [];
    this.beforeEvents = [];
    this.afterEvents = [];
  }

  Dside.prototype.setRoot = function(uri) {
    this.rootURI = uri;
  };

  Dside.prototype.getRoot = function() {
    return this.rootURI;
  };

  Dside.prototype.setRouteToMatch = function(route) {
    routeToMatch = route;
  };

  Dside.prototype.getRouteToMatch = function() {
    return routeToMatch;
  };

  Dside.prototype.register = function(route) {
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

  Dside.prototype.before = function(event) {
    this.beforeEvents.push(event);
  };

  Dside.prototype.after = function(event) {
    this.afterEvents.push(event);
  };

  Dside.prototype.matchRoute = function(currentRoute) {
    var route, _i, _len, _ref;
    _ref = this.routes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      if (route.uri === currentRoute) {
        return route;
      }
    }
    return false;
  };

  Dside.prototype.dispatchMultipleEvents = function(events) {
    var event, _i, _len;
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      this.dispatch(event);
    }
  };

  Dside.prototype.dispatch = function(dispatchEvent) {
    var dis, obj;
    dis = dispatchEvent.split(delimiter);
    obj = new window[dis[0]]();
    obj[dis[1]].apply(obj, []);
  };


  /*
  	 * Try and match a route, if you do we get the key to the reoute
  	 * The beofre after actions are dispatched, then the main route,
  	 * then the after filters.
  	 *
   */

  Dside.prototype.run = function() {
    var match;
    this.setRouteToMatch(this.currentURI.replace(this.getRoot(), ''));
    if (match = this.matchRoute(this.getRouteToMatch())) {
      this.dispatchMultipleEvents(this.beforeEvents);
      if (match.hasOwnProperty('before')) {
        this.dispatchMultipleEvents(match.before);
      }
      this.dispatch(match.event);
      this.dispatchMultipleEvents(this.afterEvents);
      if (match.hasOwnProperty('after')) {
        this.dispatchMultipleEvents(match.after);
      }
    }
  };

  return Dside;

})();

Dside = new Dside();
