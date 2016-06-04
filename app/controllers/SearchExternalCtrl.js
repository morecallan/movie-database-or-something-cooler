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
            $rootScope.moviesFromDatabase.forEach(function(movie) {
                movie.detailsMode = false;
            })
            $location.path("/results");
        });
    }

});