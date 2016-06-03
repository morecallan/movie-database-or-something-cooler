app.factory("APIFactory", function($q, $http){

    var movieList = function(searchText){
        return $q(function(resolve, reject){
          $http.get(`http://www.omdbapi.com/?s=${searchText}&y=&plot=short&r=json`)
            .success(function(returnObject){ 
                console.log(returnObject);
                resolve(returnObject);
            })
            .error(function(error){
                reject(error);
            });  
        }); 
    }

    return {movieList:movieList};
});




