var lst = angular.module("lst",['ng-sortable'])

lst.controller("MainCtrl", ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

  $scope.items = [];
  $scope.backlogOpen = false;
  $scope.newItem = "";

  $http.get('http://lst-app.herokuapp.com/items').
  success(function(data, status, headers, config) {
    console.log(data)
    // add to list
    $scope.items.push(newItem);
  }).
  error(function(data, status, headers, config) {
    console.log(data)
  });

	// $scope.items = [
	// {
 //    priority: 1,
	// 	value:'learn Sortable',
	// 	created: new Date(),
 //    backlogged: false
	// },
	// {
 //    priority: null,
	// 	value:'use gn-sortable',
	// 	created: new Date(),
 //    backlogged: true
	// },
	// {
 //    priority: null,
	// 	value:'Enjoy',
	// 	created: new Date(),
 //    backlogged: true
	// },
 //  {
 //    priority: null,
 //    value:'test 1',
 //    created: new Date(),
 //    backlogged: true
 //  },
 //  {
 //    priority: null,
 //    value:'test barry',
 //    created: new Date(),
 //    backlogged: true
 //  },
 //  {
 //    priority: null,
 //    value:'selma',
 //    created: new Date(),
 //    backlogged: true
 //  }
 //  ];



	$scope.addItem = function (clickEvent) {

    if (clickEvent.keyCode === 13)
    {
      var newItem = { 
        priority:     1,
        value:        $scope.newItem,
        created: new Date(),
        backlogged:   false
      };

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
   
  $scope.done = function () {
    // delete from server


    // remove from list
    console.log(this.item)
    var index = $scope.items.indexOf(this.item);
    $scope.items.splice(index, 1);     
  }


  $scope.moveFromBacklogToList = function () {
    // add to items list
    this.item.backlogged = false;
  }

  $scope.moveFromListToBacklog = function () {
    // add to backlog
    this.item.backlogged = true;
  }


}]);