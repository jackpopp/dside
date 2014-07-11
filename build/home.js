var Home;

Home = function() {
  this.beforeAction = function() {
    console.log('im always called before');
  };
  this.before = function() {
    console.log('sometimes called before');
  };
  this.after = function() {
    console.log('sometimes called after');
  };
  this.afterAction = function() {
    console.log('im always called after');
  };
  this.getData = function() {
    console.log('getData');
  };
  this.indexPage = function() {
    console.log('index');
  };
};
