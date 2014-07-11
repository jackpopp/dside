## Dside
### Javascript dispatcher

Register routes and dispatch events if the current route matches.
Construct an object and then dispatch an event from the object.
Register before and after events on certain routes.
```javascript
	Dside.register([
		{uri: '', event:'Home@getData'},
		{uri:'index.html', event:'Home@indexPage'}
	])

	Dside.run()
```
Register before and after events on certain routes and global before and event events.
```javascript
	Dside.before('Home@beforeAction')
	Dside.after('Home@afterAction')

	Dside.run()
```
Register an anonymous function as a dispatch event.
```javascript
	Dside.register([
		{uri:'index.html', event: function(){
			console.log('anonymous');
		}},
	])

	Dside.run()
```