var lst = angular.module("lst",['ng-sortable'])

lst.controller("MainCtrl", ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

var urlBase = "http://lst-app.herokuapp.com";
//var urlBase = "http://localhost:3000";

  $scope.items = [];
  $scope.backlogOpen = false;
  $scope.newItemValue = "";
  $scope.numBacklogged = 0;
  $scope.numNotBacklogged = 0;

  // Stay up to date with how many tasks are/aren't backlogged
  $scope.$watch(function(){

    $scope.numBacklogged = 0;
    $scope.numNotBacklogged = 0;

    for (var i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].backlogged === true) {
        $scope.numBacklogged++;
      } else {
        $scope.numNotBacklogged++;
      }
    }

  })


  $http.get(urlBase + '/items').
  success(function(data, status, headers, config) {
    // add to list
    $scope.items = data;
  }).
  error(function(data, status, headers, config) {
    console.log(data)
  });



	$scope.addItem = function (clickEvent) {

    if (clickEvent.keyCode === 13)
    {
      var newItem = { 
        value:        $scope.newItemValue,
        created:      new Date(),
        backlogged:   false
      };

      // post to server
      $http.post(urlBase + '/items/add', newItem).
      success(function(data, status, headers, config) {
        console.log(data)
        // add to list
        $scope.items.push(newItem);
        $scope.newItemValue = "";
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
    $http.post(urlBase + '/items/delete', {id: this.item._id}).
    success(function(data, status, headers, config) {
      var index = $scope.items.indexOf(this.item);
      console.log(index)
      $scope.items.splice(index, 1);  
    }).
    error(function(data, status, headers, config) {
      console.log(data)
    });
  }

  $scope.moveFromBacklogToList = function () {
    // remove from backlog
    this.item.backlogged = false;

    $http.post(urlBase + '/items/backlog', this.item).
    success(function(data, status, headers, config) {
      console.log(data)
    }).
    error(function(data, status, headers, config) {
      console.log(data)
    });
  }

  $scope.moveFromListToBacklog = function () {
    // add to backlog
    this.item.backlogged = true;

    $http.post(urlBase + '/items/backlog', this.item).
    success(function(data, status, headers, config) {
      console.log(data)
    }).
    error(function(data, status, headers, config) {
      console.log(data)
    });
  }


}]);