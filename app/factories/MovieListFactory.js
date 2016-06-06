"use strict";

app.factory("MovieListFactory", function($q, $http, firebaseURL, AuthFactory){

//Firebase: Adds movie to "To Watch" section of watchlist. (Full movie data passed).
    let addToWatchList = (movie) => {
        let user=AuthFactory.getUser();

        return $q(function(resolve,reject){
            $http.post(`${firebaseURL}movies.json`,
                JSON.stringify({
                    Title:movie.Title,
                    Year:movie.Year,
                    imdbID:movie.imdbID,
                    Type:movie.Type,
                    Poster:movie.Poster,
                    Rating: 0,
                    uid:user.uid,
                    watched:false
                }))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
        });
    };

//Firebase: Updates movie already in watchlist. (Full movie data passed).
    let updatedWatchListBasedOnRating = (movie) => {
        let user=AuthFactory.getUser();

        return $q(function(resolve,reject){
            $http.put(`${firebaseURL}movies/${movie.id}.json`,
                JSON.stringify({
                    Title:movie.Title,
                    Year:movie.Year,
                    imdbID:movie.imdbID,
                    Type:movie.Type,
                    Poster:movie.Poster,
                    Rating: movie.rating,
                    uid:user.uid,
                    watched:movie.watched
                }))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
        });
    };

//Firebase: Removes selected movie from watchlist. (Only movie id key passed).
    let deleteMovieFromWatchlist = (movieID) =>{
        return $q(function(resolve, reject){
            $http
            .delete(`${firebaseURL}movies/${movieID}.json`)
            .success(function(objectFromFirebase){
                resolve(objectFromFirebase);
            })
            .error(function(error){
                reject(error);
            });
        });
    };

    
// Firebase: Retrieves full watchlist for logged-in user from database. (Only movie id key passed).
    let myMovieList = () => {
        let user = AuthFactory.getUser();
        let items =[ ];
        
        return $q(function(resolve, reject){
          $http.get(`${firebaseURL}movies.json?orderBy="uid"&equalTo="${user.uid}"`)
            .success(function(returnObject){ 
                Object.keys(returnObject).forEach(function(key){
                returnObject[key].id=key;
                items.push(returnObject[key]);
            });
                resolve(items);
            })
            .error(function(error){
                reject(error);
            });  
        }); 
    };

    return {myMovieList:myMovieList, addToWatchList:addToWatchList, updatedWatchListBasedOnRating:updatedWatchListBasedOnRating, deleteMovieFromWatchlist:deleteMovieFromWatchlist};
});