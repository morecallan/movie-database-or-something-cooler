"use strict";


app.factory("MovieListFactory", function($q, $http,AuthFactory){

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
                    uid:user.uid,
                    watched:false
                }))
            .success(function(response){
                resolve(response);
            })
        })
    }

    
    //get watch list from firebase
    var myMovieList = function(){
        var user=AuthFactory.getUser();
        var items=[];
        
        return $q(function(resolve, reject){
          $http.get(`https://supercoolmoviedb.firebaseio.com/movies.json?orderBy="uid"&equalTo="${user.uid}"`)
            .success(function(returnObject){ 
                Object.keys(returnObject).forEach(function(key){
                items.push(returnObject[key]);
            });
                resolve(items);
            })
            .error(function(error){
                reject(error);
            });  
        }); 
    }

    return {myMovieList:myMovieList,addToWatchList:addToWatchList};
});