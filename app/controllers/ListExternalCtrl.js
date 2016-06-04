"use strict";


app.controller('ListExternalCtrl', function ($scope, $rootScope, APIFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/
    $scope.currentSelectedMovieDetails = [];
    $scope.detailsMode = false;

    $scope.showDetails = function(movie) {
        let movieID = movie.imdbID;
        APIFactory.getMovieDetailsFromId(movieID).then((movieResultsFromDatabase) => {
            $scope.currentSelectedMovieDetails = movieResultsFromDatabase;
            console.log($scope.currentSelectedMovieDetails);
            $scope.detailsMode = true;
            $scope.updatecurrentSelectedMovieViewable(movieID)
        });
    }

    $scope.updatecurrentSelectedMovieViewable = function(movieimdbID) {
        let currentMovie = $rootScope.moviesFromDatabase.filter(function( obj ) {
          return obj.imdbID == movieimdbID;
        })[0];
        
        currentMovie.detailsMode = true;
    }


});