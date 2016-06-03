"use strict";


app.factory("MovieListFactory", function($q, $http){

    var myMovieList = function(){
        return $q(function(resolve, reject){
          $http.get(`****URL FOR Firebase`)
            .success(function(returnObject){ 
                resolve(returnObject);
            })
            .error(function(error){
                reject(error);
            });  
        }); 
    }

    return {myMovieList:myMovieList};
});