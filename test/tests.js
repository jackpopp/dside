QUnit.testStart(function(){
	Dside.reset();
	Dside.setRoot('http://localhost/dside/');
});

// Test setting root

QUnit.test("setRoot", function(assert){

	Dside.setRoot('http://localhost/dside/');

	assert.equal(Dside.getRoot(), 'http://localhost/dside/', 'Root URI set correctly');
});

// Test registering a route

QUnit.test("routing.register", function(assert){

	Dside.register([
		{uri:'', event:'indexPage', uses: 'home'},
	]);

	assert.equal(Dside.routes.length, 1, 'Expect routes array to have one element');
	assert.equal(Dside.routes[0].uri, '', 'Expect first route uri to be ""');
	assert.equal(Dside.routes[0].event, 'indexPage', 'Expect first route event to be indexPage');
	assert.equal(Dside.routes[0].uses, 'home', 'Expect first route uses to be home');
});

// Test matching a route

QUnit.test('routing.matchStatic', function(assert){
	route = {uri:'test', event:'indexPage', uses: 'home'}

	Dside.register(route);
	assert.equal(Dside.matchRoute('fail'), false, 'Should not match and return false')
	assert.equal(Dside.matchRoute('test'), route, 'Should match and return route object')
})


QUnit.test('routing.matchDynamic', function(assert){
	route = {uri:'test/{id}', event:'indexPage', uses: 'home'}

	Dside.register(route);
	assert.equal(Dside.matchRoute('test/4'), route, 'Should match and return route object');
	assert.equal(Dside.matchRoute('test/6'), route, 'Should match and return route object');
	assert.equal(Dside.matchRoute('test/5/5'), false, 'Should not match and return false');
})

// Test before and after global filters

QUnit.test("filters.global", function(assert)
{
	Dside.before('Home@beforeAction');
	Dside.after('Home@afterAction');

	assert.equal(Dside.beforeEvents.length, 1, 'Before filter array has one filter');
	assert.equal(Dside.beforeEvents[0], 'Home@beforeAction', 'Filter equal to Home@beforeAction');
	assert.equal(Dside.afterEvents.length, 1, 'After filter array has one filter');
	assert.equal(Dside.afterEvents[0], 'Home@afterAction', 'Filter equal to Home@afterAction');
});

// Test reset function

QUnit.test('reset', function(assert)
{
	Dside.reset();
	assert.equal(Dside.routes.length , 0);
	assert.equal(Dside.getRoot(), null, 0);
	assert.equal(Dside.beforeEvents.length , 0);
	assert.equal(Dside.afterEvents.length , 0);
});

// Test matching a route and checking an global event was fire

QUnit.test('eventFired', function(assert)
{
	pie = 'orange';
	applePie = function(){
		pie = 'apple';
	};

	Dside.setRoot('http://localhost/dside/');
	Dside.register([
		{uri:'', event:'applePie'},
	]);

	Dside.currentURI = 'http://localhost/dside/'
	Dside.run();

	assert.equal(pie, 'apple');
});


// Test matching a route and checking an object was constructed and an function belonging to the object was fired 

QUnit.test('eventFromObjectFired', function(assert)
{
	page = null;
	Home = function(){
		this.index = function(){
			page = 'home';
		};
	};
	home = new Home();

	Dside.setRoot('http://localhost/dside/');
	Dside.register([
		{uri:'', event:'index', uses:'home'},
	]);

	Dside.currentURI = 'http://localhost/dside/'
	Dside.run();

	assert.equal(page, 'home');
});