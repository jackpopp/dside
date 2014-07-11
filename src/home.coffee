Home = ->
	this.beforeAction = ->
		console.log 'im always called before'
		return

	this.before = ->
		console.log 'sometimes caled before'
		return

	this.afterAction = ->
		console.log 'im always called after'
		return

	this.getData = ->
		console.log 'getData'
		return

	this.indexPage = ->
		console.log 'index'
		return
	return