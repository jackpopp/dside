## Dside
### Javascript dispatcher

Register the root uri
```javascript
Dside.setRoot('http://localhost/dside/');
```

Register routes and dispatch events if the current route matches.
Construct an object and then dispatch an event from the object.
You can register an array of routes or a single route.
```javascript
Dside.register([
	{uri: '', event:'Home@getData'},
	{uri:'index.html', event:'Home@indexPage'}
]);

// or

Dside.register({uri: '', event:'Home@getData'});

Dside.run();

```

Register dynamic routes, this will match any routes that are the same pattern
```javascript
route = {uri:'user/{id}', event:'getUserData', uses: 'user'};
Dside.register(route);

// will match
// user/6
// user/76
```

Register before and after events on certain routes and global before and event events.
```javascript
Dside.register([
	{uri: '', event:'Home@getData', before: ['Home@before'], after: ['Home@after']},
]);
Dside.before('Home@beforeAction');
Dside.after('Home@afterAction');

Dside.run();
```

Register an anonymous function as a dispatch event.
```javascript
Dside.register([
	{uri:'index.html', event: function(){
		console.log('anonymous');
	}},
]);

Dside.run();
```

Construct an object
```javascript

Home = function(){
	constructor = function(){
		console.log('construct');
	};

	construct();
};

Dside.register([
	{uri:'', event:'Home'},
]);

Dside.run();
```

Dispatch a global function
```javascript
function someFunction(){
		console.log('@someFunction');
}

Dside.register([
	{uri:'', event:'someFunction'},
]);

Dside.run();
```

Dispatch an event using an already constructed object
```javascript
home = new Home();

Dside.register([
	{uri:'index.html', event:'indexPage', uses: 'home'},
]);

Dside.run();
```

### To Do
dynamic routing  

pass dynamic values to function as params  

dispatch multiple events for single registered route  

load source when route hit  

use previously constructed object  
