"use strict";


app.factory("MovieListFactory", function($q, $http, firebaseURL, AuthFactory){

    //add movie to my watch list
    var addToWatchList=function(movie){
        var user=AuthFactory.getUser();

        return $q(function(resolve,reject){
            $http.post(`https://supercoolmoviedb.firebaseio.com/movies.json`,
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
        })
    }

     //update movie to my watch list
    var updatedWatchListBasedOnRating=function(movie){
        var user=AuthFactory.getUser();

        return $q(function(resolve,reject){
            $http.put(`https://supercoolmoviedb.firebaseio.com/movies/${movie.id}.json`,
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
        })
    }

    var deleteMovieFromWatchlist = function(movieID){
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

    
    //get watch list from firebase
    var myMovieList = function(){
        var user=AuthFactory.getUser();
        var items=[];
        
        return $q(function(resolve, reject){
          $http.get(`https://supercoolmoviedb.firebaseio.com/movies.json?orderBy="uid"&equalTo="${user.uid}"`)
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
    }

    return {myMovieList:myMovieList,addToWatchList:addToWatchList,updatedWatchListBasedOnRating:updatedWatchListBasedOnRating, deleteMovieFromWatchlist:deleteMovieFromWatchlist};
});