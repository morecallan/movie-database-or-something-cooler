"use strict";


app.controller('ListExternalCtrl', function ($scope, $location, $rootScope, APIFactory, MovieListFactory, firebaseURL) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/
    $scope.currentSelectedMovieDetails = [];
    $scope.unwatchedMoviesList = false;


    $scope.ratingPreviewFill = function(movie, index) {
        if (!$scope.watchListMovies[movie].stars[index].filled) {
            for (var i = 0; i <= index; i++) {
                 $scope.watchListMovies[movie].stars[i].filled = true;
            }
        } else if ($scope.watchListMovies[movie].stars[index].filled) {
            for (var i = index+1; i < $scope.watchListMovies[movie].stars.length; i++) {
                $scope.watchListMovies[movie].stars[i].filled = false;
            }
        }
    }

    $scope.clearStars = function(movie) {
        if (!$scope.watchListMovies[movie].watched) {
            for (var i = 0; i < 5; i++) {
                 $scope.watchListMovies[movie].stars[i].filled = false;
            }
        }
    }

    $scope.parseIntoStars = function(movieList) {
        movieList.forEach(function(movie) {
            let starsToFill = parseInt(movie.Rating) - 1;
            movie.stars = [{filled: false}, {filled: false}, {filled: false}, {filled: false}, {filled: false}];
            for (var i = 0; i <= starsToFill; i++) {
                movie.stars[i].filled = true;
            }
        })
        $scope.watchListMovies = movieList;
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


    $scope.trashHover = function(event) {
        event.currentTarget.childNodes[1].childNodes[1].classList.remove("ng-hide");
    }

    $scope.trashHoverOut = function(event) {
        event.currentTarget.childNodes[1].childNodes[1].classList.add("ng-hide");
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
            Materialize.toast('Movie added!', 4000, 'teal');
        })
    };

    $scope.deleteMovieFromWatchlist = function($index){
        MovieListFactory.deleteMovieFromWatchlist($scope.watchListMovies[$index].id).then(function(){
            $scope.showWatchList();
        });
    }

    //display watchlist
    $scope.showWatchList=function(){  
        $scope.watchListMovies=[];
        MovieListFactory.myMovieList().then(function(list){
            if (list === null) {
                $scope.unwatchedMoviesList = false;
            } else {
                let unwatchedMovies = list.filter(function(movieInList) {
                    return movieInList.watched === false;
                })
                console.log("unwatchedMovies", unwatchedMovies);
                if (unwatchedMovies.length < 1) {
                    $scope.unwatchedMoviesList = false;
                } else {
                    $scope.unwatchedMoviesList = true;
                }
            }
            console.log($scope.unwatchedMoviesList);
            $scope.watchListMovies=list;
            $scope.parseIntoStars($scope.watchListMovies);
        });
    };
    
    $scope.showWatchList();

});

