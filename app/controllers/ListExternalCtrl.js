"use strict";


app.controller('ListExternalCtrl', function ($scope, $location, $rootScope, $timeout, $anchorScroll, APIFactory, MovieListFactory, firebaseURL) {

/********************************************
**        Variables for PAGE VIEW          **
********************************************/
    $rootScope.moviesFromDatabase = [];         //USE: Display array of movie results from OMDb.

    $scope.moviePage = 1;                       //USE: Page return value from search.
    $scope.disableMoreButton = false;           //USE: If a call is made to OMDB and returns no additional results.
    $scope.noMoviesBack = false;                //USE: If OMDB results return nothing.
    $scope.currentSelectedMovieDetails = [];    //USE: Details for one specific movie from OMDb.
    $scope.unwatchedMoviesList = false;         //USE: If user has no 'watched: false' in watchlist database.
    $scope.noResultsBack = true;                //USE: If a call has yet to be made to database.
    $rootScope.lastLoaded = false;              //USE: Make sure NG Repeat has fully populated.
    $scope.sLeft = 0;                           //USE: To track scrolling pixels.

       
    let moviediv = document.getElementById("movieList");



/********************************************
**              SEARCH OMDB                **
********************************************/

    //OMDB: Clears out 'no results card' when user starts new search.
    $scope.clearNoResultsCard = function() {
        $scope.noMoviesBack = false;
    };

    //OMDB: Resets search submission.
    $scope.submitSearchText = () => {
        $rootScope.moviesFromDatabase = [];
        $scope.moviePage = 1;
        $scope.makeRequestToDatabase();
    };

    //OMDB: Sends GET request to OMDb based on user's search submission.
    $scope.makeRequestToDatabase = () => {
        APIFactory.movieList($scope.searchText, $scope.moviePage)
        .then((movieResultsFromDatabase) => {
            if ((movieResultsFromDatabase.Response === "False" || movieResultsFromDatabase.Response === false) && $rootScope.moviesFromDatabase.length < 1) {
                $scope.noMoviesBack = true;
            } else if ((movieResultsFromDatabase.Response === "False" || movieResultsFromDatabase.Response === false) && $rootScope.moviesFromDatabase.length >= 1) {
                $scope.disableMoreButton = true;
                Materialize.toast(`Could not find any more movies with "${$scope.searchText}" in the title.`, 4000, 'teal');
            } else {
                $scope.noMoviesBack = false;
                $scope.disableMoreButton = false;
                movieResultsFromDatabase.Search.forEach((movie) => {
                    $rootScope.moviesFromDatabase.push(movie);
                });
                $rootScope.moviesFromDatabase.forEach((movie) => {
                    if (movie.Poster === "N/A") {
                        movie.Poster = "img/movie-dog6.jpg";
                    }
                    movie.detailsMode = false;
                });
            }   
        });
    };

    //OMDB: Loads next page of results from OMDb.
    $scope.showMoreMovies = () => {
        $scope.moviePage ++;
        $scope.makeRequestToDatabase();
    };




/********************************************
**       RESULTS FROM OMDB DISPLAY         **
********************************************/

//OMDB Results: When user clicks on details button, retrieve additional info from API call.
    $scope.showDetails = (movie) => {
        let movieID = movie.imdbID;
        APIFactory.getMovieDetailsFromId(movieID).then((movieResultsFromDatabase) => {
            $scope.currentSelectedMovieDetails = movieResultsFromDatabase;
            $scope.updatecurrentSelectedMovieViewable(movieID);
        });
    };

//DOM CTRL/OMDB Results: Removes overlay from all other cards so only one has detail view at a time.
    $scope.removeAllSelectedMovieViewable = () => {
        $rootScope.moviesFromDatabase.forEach((movie) => {
            movie.detailsMode = false;
        });
    };

//DOM CTRL/OMDB Results: Create overlay with detail information.
    $scope.updatecurrentSelectedMovieViewable = (movieimdbID) => {
        let currentMovie = $rootScope.moviesFromDatabase.filter((obj) => {
          return obj.imdbID === movieimdbID;
        })[0];

        if (currentMovie.detailsMode) {
            $scope.removeAllSelectedMovieViewable();
        } else {
            $scope.removeAllSelectedMovieViewable();
            currentMovie.detailsMode = true;   
        }
    };




/********************************************
**            WATCHLIST DISPLAY            **
********************************************/

//OMDB Results: When user clicks on details button, retrieve additional info from API call.
    $scope.watchListShowDetails = (movie) => {
        let movieID = movie.imdbID;
        APIFactory.getMovieDetailsFromId(movieID).then((movieResultsFromDatabase) => {
            $scope.currentSelectedMovieDetails = movieResultsFromDatabase;
        });
    };




/********************************************
**            WATCHLIST CONTROL            **
********************************************/

//Watchlist: Add Searched Movie to watchlist.
    $scope.addToWatchList = (moviesFromDatabase) => {
        MovieListFactory.addToWatchList(moviesFromDatabase).then(() => {
            Materialize.toast(`"${moviesFromDatabase.Title}" added to watchlist!`, 4000, 'teal');
        });
    };



//Watchlist: Display watchlist then display star value based on rating in database.
    $scope.showWatchList = () => {
        $rootScope.lastLoaded = false;  
        $scope.watchListMovies=[];
        MovieListFactory.myMovieList().then((list) => {
            $rootScope.lastLoaded = false;  
            $scope.noResultsBack = false;
            if (list === null) {
                $scope.unwatchedMoviesList = false;
            } else {
                let unwatchedMovies = list.filter((movieInList) => {
                    return movieInList.watched === false;
                });
                if (unwatchedMovies.length < 1) {
                    $scope.unwatchedMoviesList = false;
                } else {
                    $scope.unwatchedMoviesList = true;
                }
            }
            $scope.watchListMovies=list;
            moviediv.classList.remove("animated", "fadeOut");
            moviediv.classList.add("animated", "fadeIn");
            $scope.parseIntoStars($scope.watchListMovies);
        });
    };




/********************************************
**             DELETING MOVIE              **
********************************************/

    //DOM CTRL: Show trash button on one movie when hovering on it.
    $scope.trashHover = (event) => {
        event.currentTarget.childNodes[1].childNodes[1].classList.remove("ng-hide");
    };

    $scope.trashHoverOut = (event) => {
        event.currentTarget.childNodes[1].childNodes[1].classList.add("ng-hide");
    };


    //Watchlist: Delete Movie from Database.
    $scope.deleteMovieFromWatchlist = ($index, $event) => {
        moviediv.classList.add("animated", "fadeOut");

        let divWithScrollProp = document.getElementsByClassName("snap-card")[0];
        $scope.sLeft = divWithScrollProp.scrollLeft;
        MovieListFactory.deleteMovieFromWatchlist($scope.watchListMovies[$index].id).then(() => {
            Materialize.toast(`"${$scope.watchListMovies[$index].Title}" removed from watchlist!`, 4000, 'teal');
            $scope.showWatchList();
            $scope.$watch(function(){return $rootScope.lastLoaded === true;}, function(){
                divWithScrollProp.scrollLeft =  $scope.sLeft; 
            });
        });
    };




/********************************************
**              RATING MOVIE               **
********************************************/

    //DOM CTRL: Fills in and removes fill from stars based on where the user hovers.    
    $scope.ratingPreviewFill = (movie, index) => {
        if (!$scope.watchListMovies[movie].stars[index].filled) {
            for (var i = 0; i <= index; i++) {
                 $scope.watchListMovies[movie].stars[i].filled = true;
            }
        } else if ($scope.watchListMovies[movie].stars[index].filled) {
            for (var j = index+1; j < $scope.watchListMovies[movie].stars.length; j++) {
                $scope.watchListMovies[movie].stars[j].filled = false;
            }
        }
    };

    //DOM CTRL: Removes fill in for stars if user leaves the rating box.   
    $scope.clearStars = (movie) => {
        if (!$scope.watchListMovies[movie].watched) {
            for (var i = 0; i < 5; i++) {
                 $scope.watchListMovies[movie].stars[i].filled = false;
            }
        }
    };

    //DOM CTRL/Watchlist: Based on the database 'rating' for the movie, display stars.   
    $scope.parseIntoStars = (movieList) => {
        movieList.forEach(function(movie) {
            let starsToFill = parseInt(movie.Rating) - 1;
            movie.stars = [{filled: false}, {filled: false}, {filled: false}, {filled: false}, {filled: false}];
            for (var i = 0; i <= starsToFill; i++) {
                movie.stars[i].filled = true;
            }
        });
        $scope.watchListMovies = movieList;
    };

    //Watchlist: Based on the star clicked on, update database 'rating' for the movie.   
    $scope.ratecurrentSelectedMovie = (currentMovie, index) => {
        let rating = index + 1;
        currentMovie.rating = rating;
        currentMovie.watched = true;
        moviediv.classList.add("animated", "fadeIn");
        MovieListFactory.updatedWatchListBasedOnRating(currentMovie).then(() => {
            $scope.showWatchList();
        });
        Materialize.toast(`You rated "${currentMovie.Title}" ${rating} stars`, 4000, 'teal');
    };




/********************************************
**          INITIALIZING WATCHLIST         **
********************************************/

    //Watchlist: Initialize watchlist display.
    $scope.showWatchList();
});



/********************************************
**       WATCH FOR NG REPEAT COMPLETE      **
********************************************/
app.directive('myRepeatDirective', function($rootScope) {
  return function(scope, element, attrs) {
    if (scope.$last){
      $rootScope.lastLoaded = true;
    }
  };
});
