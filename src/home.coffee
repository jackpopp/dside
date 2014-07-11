Home = ->
	this.beforeAction = ->
		console.log 'im always called before'
		return

	this.before = ->
		console.log 'sometimes called before'
		return

	this.after = ->
		console.log 'sometimes called after'
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