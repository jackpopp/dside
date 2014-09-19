class DsideDipatcher
	routeToMatch = null
	delimiter = '@'
	queryStringDelimiter = '?'
	hashDelimiter = '#'
	variables = []
	scope = window

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
		routeToMatch = @prepareRoute(route)
		return

	getRouteToMatch: -> 
		return routeToMatch

	setScope: (scope) ->
		scope = scope
		return

	getScope: ->
		return scope

	prepareRoute: (route) ->
		return @removeTrailingSlashFromUri(route.split(queryStringDelimiter)[0].split(hashDelimiter)[0])

	removeTrailingSlashFromUri: (uri) ->
		if uri.indexOf("/", uri.length-1) isnt -1
			return uri.slice(0, uri.length-1)
			
		return uri

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

	###
	# If callback then run it
	# Else split the string and check it's length
	#
	# If length is over 1 element then we check if only the second element is filled
	# If it is then we're firing a function, if both are filled we're constructing an object
	# and firing a function from that object
	#
	# 
	###

	dispatch: (dispatchEvent, paramaters = [], uses = null, construct = null) ->
		if typeof dispatchEvent is 'function'
			dispatchEvent()
		else
			dis = dispatchEvent.split(delimiter)
			if dis.length > 1
				if dis[0] is ''
					# execute a function
					window[dis[1]].apply(null, paramaters)
				else
					# create object
					obj = new window[dis[0]]()
					# run function, apply the context of this in the created obj as itself
					obj[dis[1]].apply(obj, paramaters)
			else
				if uses isnt null
					window[uses][dis].apply(null, paramaters)
				else
					# create an object
					new window[dis](paramaters)
					#@constructObject(dis, paramaters)
					#window[dis].apply(null, paramaters)
		return

	###
	#
	# Creates a new object from a passed constructor
	# This will allow us to construct modules that arent in global scope
	#
	###

	constructObject: (ctor, params) ->
	    # Use a fake constructor function with the target constructor's
	    # `prototype` property to create the object with the right prototype
	    fakeCtor = () ->
	    	return

	    fakeCtor.prototype = ctor.prototype

	    obj = new fakeCtor()

	    # Set the object's `constructor`
	    obj.constructor = ctor

	    console.log obj

	    # Call the constructor function
	    newobj = ctor.apply(obj, params)

	    # Use the returned object if there is one.
	    # Note that we handle the funky edge case of the `Function` constructor,
	    # thanks to Mike's comment below. Double-checked the spec, that should be
	    # the lot.
	    obj = newobj if (newobj isnt null and (typeof newobj is "object" or typeof newobj is "function"))        

    	# Done
    	return obj

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
			@dispatch(match.event, match.paramaters ,match.uses, match.construct)
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