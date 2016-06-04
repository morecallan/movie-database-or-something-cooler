"use strict";


app.controller('SearchExternalCtrl', function ($scope, $location, $rootScope, APIFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/
    $rootScope.moviesFromDatabase = []


    $scope.submitSearchText = function() {
      APIFactory.movieList($scope.searchText)
      .then((movieResultsFromDatabase) => {
            $rootScope.moviesFromDatabase = movieResultsFromDatabase.Search;
            console.log($rootScope.moviesFromDatabase);
            $location.path("/results");
        });
    }

});