class Dside
	routeToMatch = null
	delimiter = '@'
	variables = []

	constructor: ->
		@rootURI = 'http://localhost/dside/'
		@currentURI = document.URL
		@routes = []
		@beforeEvents = []
		@afterEvents = []

	setRoot: (uri) ->
		@rootURI = uri
		return

	getRoot: ->
		return @rootURI

	setRouteToMatch: (route) ->
		routeToMatch = route
		return

	getRouteToMatch: -> 
		return routeToMatch

	register: (route) ->
		# Detect if it's an array of arrays, if so loop through are push each one
		if route.length > 0 && route[0] instanceof Object
			for obj in route
				@routes.push obj
		else
			@routes.push route
		return

	before: (event) ->
		@beforeEvents.push event
		return

	after: (event) ->
		@afterEvents.push event
		return

	matchRoute: (currentRoute) ->
		for route in @routes
			if route.uri is currentRoute
				return route
		return false

	dispatchMultipleEvents: (events) ->
		for event in events
			@dispatch(event)
		return

	dispatch: (dispatchEvent) ->
		dis = dispatchEvent.split(delimiter)
		# create object
		obj = new window[dis[0]]()
		# run function, apply the context of this in the created obj as itself
		obj[dis[1]].apply(obj, [])
		return

	###
	# Try and match a route, if you do we get the key to the reoute
	# The beofre after actions are dispatched, then the main route,
	# then the after filters.
	#
	###

	run: ->
		@setRouteToMatch(@currentURI.replace(@getRoot(), ''))
		if match = @matchRoute(@getRouteToMatch())
			# dispatch global before events
			@dispatchMultipleEvents(@beforeEvents)
			@dispatchMultipleEvents(match.before) if match.hasOwnProperty('before')
			# dispatch main event
			@dispatch(match.event)
			# dispatch after events
			@dispatchMultipleEvents(@afterEvents)
			@dispatchMultipleEvents(match.after) if match.hasOwnProperty('after')
		return

Dside = new Dside()