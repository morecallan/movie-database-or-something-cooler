app.factory("APIFactory", function($q, $http){

    var movieList = function(){
        return $q(function(resolve, reject){
          $http.get(`****URL FOR API`)
            .success(function(returnObject){ 
                resolve(returnObject);
            })
            .error(function(error){
                reject(error);
            });  
        }); 
    }

    return {movieList:movieList};
});