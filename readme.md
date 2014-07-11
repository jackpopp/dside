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

Dispatch a global function
```javascript
function someFunction()
{
		console.log('someFunction')
}
Dside.register([
	{uri:'', event:'someFunction'},
])
Dside.run()
```

Dispatch an event using an already constructed object
```javascript
home = new Home();

Dside.register([
	{uri:'index.html', event:'indexPage', uses: 'home'},
])
```

### To Do
dynamic routing  

pass dynamic values to function as params  

dispatch multiple events for single registered route  

global function from route  

load source when route hit  

use previously constructed object  

pre construct objects