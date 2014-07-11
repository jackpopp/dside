## Dside
### Javascript route dispatcher

Register routes and dispatch events if the current route matches.
Constructs an object and then dispatches an event from the object, if the event matches.
Register before and after events on certain routes
```javascript
	Dside.register([
		{uri: '', event:'Home@getData', before: ['Home@before'], after: ['Home@after']},
		{uri:'index.html', event:'Home@indexPage'}
	])

	Dside.run()
```
Register an anonymous function as a dispatch event
```javascript
	Dside.register([
		{uri:'index.html', event: function(){
			console.log('anonymous');
		}},
	])

	Dside.run()
```