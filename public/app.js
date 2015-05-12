var lst = angular.module("lst",['ng-sortable'])

lst.controller("MainCtrl", ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

var urlBase = "http://lst-app.herokuapp.com";
var urlBase = "http://localhost:3000";

  $scope.items = [];
  $scope.backlogOpen = false;
  $scope.newItemValue = "";
  $scope.numBacklogged = 0;
  $scope.numNotBacklogged = 0;
  $scope.loading = false;

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
    console.log(data)
    // add to list
    $scope.items = data;
  }).
  error(function(data, status, headers, config) {
    console.log(data)
  });

  $scope.updateCurrent = function (evt) {
    console.log($scope.items)

    if ($scope.items.length > 0) {
      $scope.loading = true;

      for (var i = 0; i < $scope.items.length; i++) {
        // make sure all items are not set to current item
        $scope.items[i].current = false;
      }
      // show loading bar

      // set the first item on the list as the current
      $scope.items[0].current = true;

      $http.post(urlBase + '/items/current', $scope.items[0]).
      success(function(data, status, headers, config) {
        $scope.loading = false;
      }).
      error(function(data, status, headers, config) {
        console.log(data)
        $scope.loading = false;
      });
    }
  }

	$scope.addItem = function (clickEvent) {
    if (clickEvent.keyCode === 13)
    {
      $scope.loading = true;
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
        $scope.items.push(data);
        $scope.newItemValue = "";
        // collapse mobile keyboard
        clickEvent.target.blur()
        $scope.loading = false;
      }).
      error(function(data, status, headers, config) {
        console.log(data)
        $scope.loading = false;
      });
    }
  }
   
  $scope.done = function () {
    // delete from server
    $scope.loading = true;
    var index = $scope.items.indexOf(this.item);
    $http.post(urlBase + '/items/delete', this.item).
    success(function(data, status, headers, config) {
      console.log(index)
      $scope.items.splice(index, 1);  
      $scope.loading = false;
    }).
    error(function(data, status, headers, config) {
      console.log(data)
      $scope.loading = false;
    });
  }

  $scope.moveFromBacklogToList = function () {
    // remove from backlog
    this.item.backlogged = false;
    $scope.loading = true;
    $http.post(urlBase + '/items/backlog', this.item).
    success(function(data, status, headers, config) {
      console.log(data)
      $scope.loading = false;
    }).
    error(function(data, status, headers, config) {
      console.log(data)
      $scope.loading = false;
    });
  }

  $scope.moveFromListToBacklog = function () {
    // add to backlog
    this.item.backlogged = true;
    $scope.loading = true;

    $http.post(urlBase + '/items/backlog', this.item).
    success(function(data, status, headers, config) {
      console.log(data)
      $scope.loading = false;
    }).
    error(function(data, status, headers, config) {
      console.log(data)
      $scope.loading = false;
    });
  }


}]);