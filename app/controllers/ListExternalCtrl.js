"use strict";


app.controller('ListExternalCtrl', function ($scope, $rootScope, APIFactory, MovieListFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/
    $scope.currentSelectedMovieDetails = [];

    $scope.showDetails = function(movie) {
        let movieID = movie.imdbID;
        APIFactory.getMovieDetailsFromId(movieID).then((movieResultsFromDatabase) => {
            $scope.currentSelectedMovieDetails = movieResultsFromDatabase;
            $scope.updatecurrentSelectedMovieViewable(movieID)
        });
    }

    $scope.updatecurrentSelectedMovieViewable = function(movieimdbID) {
        let currentMovie = $rootScope.moviesFromDatabase.filter(function( obj ) {
          return obj.imdbID == movieimdbID;
        })[0];

        if (currentMovie.detailsMode) {
            $scope.removeAllSelectedMovieViewable();
        } else {
            $scope.removeAllSelectedMovieViewable();
            currentMovie.detailsMode = true;   
        }
        
    }

    $scope.removeAllSelectedMovieViewable = function() {
        $rootScope.moviesFromDatabase.forEach(function(movie) {
            movie.detailsMode = false;
        })
    }

    //Add Searched Movie to My Watch List
    $scope.addToWatchList=function(moviesFromDatabase){
        MovieListFactory.addToWatchList(moviesFromDatabase).then(function(response){
            console.log("post", response);

            MovieListFactory.myMovieList().then(function(response){
                console.log(response);
            })
        })
    }


});