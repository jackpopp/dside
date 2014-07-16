class DsideDipatcher
	routeToMatch = null
	delimiter = '@'
	variables = []

	constructor: ->
		@rootURI = null
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
			# check if exact match
			if route.uri is currentRoute
				return route
			# check if dynamic match, if there are then lets grab the vars from the uri
			else if @matchDynamicRoute(route.uri, currentRoute)
				route['paramaters'] = @resolveParamatersFromRoute(route, currentRoute)
				return route
		return false

	matchDynamicRoute: (uri, current) ->
		# match string should look like this
		# 'test\/[a-zA-Z%_\\-0-9\(\\)]+'
		uri = uri.replace(/{.*?}/g, '[a-zA-Z%_\\-0-9\\(\\)]+')
		reg = new RegExp('('+uri+')$', 'i')
		if current.match(reg)
			return true
		return false

	resolveParamatersFromRoute: (route, current) ->
		params = []
		routeStrings = route.uri.split('/')
		currentStrings = current.split('/')

		for key, value of routeStrings
			if value.match(/{.*?}/)
				params.push @castStringToInt(currentStrings[key])
		return params

	###
	# Helper function, will cast a string to integer if the casted value is a number
	# Otherwise will return as a string
	#
	# @return mixed
	###

	castStringToInt: (val) ->
		check = parseInt(val)
		if not isNaN(check)
			return check
		return val

	dispatchMultipleEvents: (events) ->
		for event in events
			@dispatch(event)
		return

	dispatch: (dispatchEvent, uses = null) ->
		if typeof dispatchEvent is 'function'
			dispatchEvent()
		else
			dis = dispatchEvent.split(delimiter)
			if dis.length > 1
				# create object
				obj = new window[dis[0]]()
				# run function, apply the context of this in the created obj as itself
				obj[dis[1]].apply(obj, [])
			else
				if uses isnt null
					window[uses][dis]()
				else
					window[dis]()
		return

	###
	# Try and match a route, if you do we get the key to the reoute
	# The beofre after actions are dispatched, then the main route,
	# then the after filters.
	#
	###

	run: ->
		throw new Error('No root URI set') if @getRoot() is null
		@setRouteToMatch(@currentURI.replace(@getRoot(), ''))
		if match = @matchRoute(@getRouteToMatch())
			# dispatch global before events
			@dispatchMultipleEvents(@beforeEvents)
			@dispatchMultipleEvents(match.before) if match.hasOwnProperty('before')
			# dispatch main event
			if match.hasOwnProperty('uses')
				@dispatch(match.event, match.uses)
			else
				@dispatch(match.event)
			# dispatch after events
			@dispatchMultipleEvents(@afterEvents)
			@dispatchMultipleEvents(match.after) if match.hasOwnProperty('after')
		return

	###
	# Resets Dside to a newly constructed object
	# Removes regiestered routes and filters 
	#
	###

	reset: ->
		window.Dside = null
		window.Dside = new DsideDipatcher()
		return

Dside = new DsideDipatcher()