"use strict";


app.controller('ListExternalCtrl', function ($scope, $location, $rootScope, APIFactory, MovieListFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/
    $scope.currentSelectedMovieDetails = [];

    $scope.stars = [{filled: false}, {filled: false}, {filled: false}, {filled: false}, {filled: false}];

    $scope.ratingPreviewFill = function(movie, index) {
        if (!$scope.stars[index].filled) {
            for (var i = 0; i <= index; i++) {
                $scope.stars[i].filled = true;
            }
        } else if ($scope.stars[index].filled) {
            for (var i = index+1; i < $scope.stars.length; i++) {
                $scope.stars[i].filled = false;
            }
        
        }
    }

    $scope.ratecurrentSelectedMovie = function(currentMovie, index) {
        let rating = index + 1;
        currentMovie.rating = rating;
        currentMovie.watched = true;
        MovieListFactory.updatedWatchListBasedOnRating(currentMovie);
    }

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

        })
    };

    //display watchlist
    $scope.showWatchList=function(){  
        $scope.watchListMovies=[];
        MovieListFactory.myMovieList().then(function(list){
            $scope.watchListMovies=list;
            console.log($scope.watchListMovies);
        });
    };

    $scope.showWatchList();

});

