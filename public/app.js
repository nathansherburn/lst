var lst = angular.module("lst",['ng-sortable'])

lst.controller("MainCtrl", ['$scope', function ($scope) {
	$scope.items = [
	{
		value:'learn Sortable',
		created: new Date()
	},
	{
		value:'use gn-sortable',
		created: new Date()
	},
	{
		value:'Enjoy',
		created: new Date()
	}
	];

	document.getElementById('new-item').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      // Enter pressed
      $scope.$apply(function () {
      	$scope.items.push({value: $scope.newItem, created: new Date() });
      });
      console.log($scope.items)
      this.blur();
      $scope.$apply(function () {$scope.newItem = "";});
      return false;
    }
   
   $scope.done = function () {
   	console.log('hehe');
   }
  }



}]);