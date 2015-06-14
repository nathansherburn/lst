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



  $http.get(urlBase + '/items')
  .success(function(data, status, headers, config) {
    console.log(data)
    // add to list
    $scope.items = data;

    if ($scope.items.length > 0) {
      console.log(currentExists())
      if (currentExists === false)
        makeFirstNonBackloggedCurrent();
    }
  })
  .error(function(data, status, headers, config) {
  });

  $scope.updateCurrent = function (evt) {
    // show loading bar
    $scope.loading = true;

    for (var i = 0; i < $scope.items.length; i++) {
    // make sure all items are not set to current item
    $scope.items[i].current = false;
    }

    // set the first item on the list as the current
    $scope.items[0].current = true;

    $http.post(urlBase + '/update', $scope.items)
    .success(function(data, status, headers, config) {
        $scope.loading = false;
    })
    .error(function(data, status, headers, config) {
        $scope.loading = false;
    });
  }

  $scope.addItem = function (clickEvent) {
    if (clickEvent.keyCode === 13)
    {
         $scope.loading = true;

      var newItem = { 
        value:        $scope.newItemValue,
        current:      false,
        created:      new Date(),
        backlogged:   false
      };

      setCurrentIfNone(newItem);
      
      $scope.newItemValue = "";
      // collapse mobile keyboard
      clickEvent.target.blur()

      // post to server
      $http.post(urlBase + '/new', newItem)
      .success(function(data, status, headers, config) {
        // add to list
        $scope.items.push(data);
        $scope.loading = false;
      })
      .error(function(data, status, headers, config) {
        $scope.loading = false;
      });
    }
  }
   
  $scope.done = function () {
    // delete from server
    $scope.loading = true;

    var index = $scope.items.indexOf(this.item);

    $scope.items.splice(index, 1);  

    makeFirstNonBackloggedCurrent()
    
    $http.post(urlBase + '/delete', this.item)
    .success(function(data, status, headers, config) {

      $scope.loading = false;
    })
    .error(function(data, status, headers, config) {
      $scope.loading = false;
    });
  }

  $scope.moveFromBacklogToList = function () {
    $scope.loading = true;
    // remove from backlog
    this.item.backlogged = false;
    
    setCurrentIfNone(this.item);

    $http.post(urlBase + '/update', $scope.items)
    .success(function(data, status, headers, config) {
      $scope.loading = false;
    })
    .error(function(data, status, headers, config) {
      $scope.loading = false;
    });
  }

  $scope.moveFromListToBacklog = function () {
    $scope.loading = true;

    // add to backlog and ensure not current
    this.item.backlogged = true;
    this.item.current = false;

    // make another non-backlogged tasks the current task
    if (currentExists() === false)
      makeFirstNonBackloggedCurrent()
    var bob = this.item
    $http.post(urlBase + '/update', $scope.items)
    .success(function(data, status, headers, config) {
      $scope.loading = false;
    })
    .error(function(data, status, headers, config) {
      $scope.loading = false;
    });
  }
  
  function currentExists () {

    var exists = false;

    for (var i in $scope.items) {
      if ($scope.items[i].current)
        exists = true;
    }

    return exists  
  }

  function setCurrentIfNone (potentialCurrent) {

    var exists = currentExists();

    if (!exists)
      potentialCurrent.current = true;
  }

  function makeFirstNonBackloggedCurrent () {
    for (var i = 0; i < $scope.items.length; i++ )
    {
      if ($scope.items[i].backlogged === false) {
        setCurrentIfNone($scope.items[i]);

        $http.post(urlBase + '/update', $scope.items)
        .success(function(data, status, headers, config) {
            $scope.loading = false;
        })
        .error(function(data, status, headers, config) {
            $scope.loading = false;
        });

        break;              
      }
    } 
  }



}]);