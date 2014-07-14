QUnit.testStart(function(){
	Dside.reset();
});

// Test setting root

QUnit.test("setRoot", function( assert ){

	Dside.setRoot('http://localhost/dside/');

	assert.equal(Dside.getRoot(), 'http://localhost/dside/', 'Root URI set correctly');
});

QUnit.test("registerRoute", function( assert ){

	Dside.register([
		{uri:'', event:'indexPage', uses: 'home'},
	]);

	assert.equal(Dside.routes.length, 1, 'Expect routes array to have one element');
	assert.equal(Dside.routes[0].uri, '', 'Expect first route uri to be ""');
	assert.equal(Dside.routes[0].event, 'indexPage', 'Expect first route event to be indexPage');
	assert.equal(Dside.routes[0].uses, 'home', 'Expect first route uses to be home');
});

// Test before and after global filters

QUnit.test("filters.global", function( assert )
{
	Dside.before('Home@beforeAction');
	Dside.after('Home@afterAction');

	assert.equal(Dside.beforeEvents.length, 1, 'Before filter array has one filter');
	assert.equal(Dside.beforeEvents[0], 'Home@beforeAction', 'Filter equal to Home@beforeAction');
	assert.equal(Dside.afterEvents.length, 1, 'After filter array has one filter');
	assert.equal(Dside.afterEvents[0], 'Home@afterAction', 'Filter equal to Home@afterAction');
});

// Test reset function

QUnit.test('reset', function( assert )
{
	Dside.reset();
	assert.equal(Dside.routes.length , 0);
	assert.equal(Dside.getRoot(), null, 0);
	assert.equal(Dside.beforeEvents.length , 0);
	assert.equal(Dside.afterEvents.length , 0);
});

// match a route and check event was fired
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


// check object was constructed
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