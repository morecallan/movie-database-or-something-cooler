"use strict";


app.controller('SearchExternalCtrl', function ($scope, APIFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/

    $scope.submitSearchText = function() {
      console.log($scope.searchText);
      APIFactory.movieList($scope.searchText);
    }

});