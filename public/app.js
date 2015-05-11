var lst = angular.module("lst",['ng-sortable'])

lst.controller("MainCtrl", ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
	$scope.items = [
	{
    priority: 1,
		value:'learn Sortable',
		created: new Date()
	},
	{
    priority: null,
		value:'use gn-sortable',
		created: new Date()
	},
	{
    priority: null,
		value:'Enjoy',
		created: new Date()
	}
	];

  $scope.backlog = [
  {
    priority: null,
    value:'test 1',
    created: new Date()
  },
  {
    priority: null,
    value:'test barry',
    created: new Date()
  },
  {
    priority: null,
    value:'selma',
    created: new Date()
  }
  ];


  $scope.backlogOpen = false;

	$scope.addItem = function (clickEvent) {
    console.log(clickEvent)
    if (clickEvent.keyCode === 13)
    {
      var newItem = { value: $scope.newItem, priority: 1 };

      // post to server
      $http.post('http://lst-app.herokuapp.com/items/add', newItem).
      success(function(data, status, headers, config) {
        console.log(data)
        // add to list
        $scope.items.push(newItem);
        $scope.newItem = "";
        // collapse mobile keyboard
        clickEvent.target.blur()
      }).
      error(function(data, status, headers, config) {
        console.log(data)
      });
    }
  }

  $scope.deleteItem = function (id) {
    // delete item from server

    // delete item from list
    console.log("pretending to delete " + id)
  }
   
   $scope.done = function () {
    // delete from server

    // remove from list
    console.log(this.item)
    var index = $scope.items.indexOf(this.item);
    $scope.items.splice(index, 1);     
  }


  $scope.moveFromBacklogToList = function () {
    // add to items list
    $scope.items.push(this.item);

    // remove from backlog
    var index = $scope.backlog.indexOf(this.item);
    $scope.backlog.splice(index, 1);     
  }

  $scope.moveFromListToBacklog = function () {
    // add to backlog
    $scope.backlog.push(this.item);

    // remove from items
    var index = $scope.items.indexOf(this.item);
    $scope.items.splice(index, 1);     
  }


}]);