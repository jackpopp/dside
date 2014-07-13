QUnit.test("register", function( assert ){

	Dside.setRoot('http://localhost/dside/');

	assert.equal(Dside.getRoot(), 'http://localhost/dside/', 'Root URI set correctly');
});

QUnit.test("filters", function( assert )
{
	Dside.before('Home@beforeAction');
	Dside.after('Home@afterAction');

	assert.equal(Dside.before.length, 1, 'Before filter array has one filter');
	assert.equal(Dside.after.length, 1, 'After filter array has one filter');
});