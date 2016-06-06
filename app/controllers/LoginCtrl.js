"use strict";


app.controller('LoginCtrl', function ($scope, $location, $rootScope, firebaseURL, AuthFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/
    let ref = new Firebase(firebaseURL);

    $scope.userError = false;
    $scope.userEditMode = false;
    $scope.userUploadSuccess = false;


    $scope.closeModal = () => {
        $scope.userError = false;
    };


    if($location.path() === "/login"){
        $rootScope.modeLogin = true;
    }

    if($location.path() === "/register"){
        $rootScope.modeLogin = false;
    }


    $rootScope.account = {
        email: "",
        password: ""
    };

    if($location.path() === "/logout"){
        ref.unauth();
        $rootScope.isActive = false;
    }


    $scope.register = (authFactory) => {
        ref.createUser({
            email: $rootScope.account.email,
            password: $rootScope.account.password
        }, (error, userData) => {
            if (error) {
                $scope.errorMessage = error.message;
                $scope.userError = true;
                $scope.$apply();
            } else if (userData) {
                $scope.login();
            }
        });
    };

    $scope.login = () => {
        AuthFactory
        .authenticate($rootScope.account)
        .then((userCreds) => {
            $scope.$apply(function() {
                $location.path("/watchlist");
                $rootScope.isActive = true;
            });
        })
        .catch((error) => {
                $scope.errorMessage = error.message;
                $scope.userError = true;
                $scope.$apply();
        });
    };


    $scope.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: false,  
        autoplaySpeed: 2500,
        method: {},
        event: {
            beforeChange: function (event, slick, currentSlide, nextSlide) {
            },
            afterChange: function (event, slick, currentSlide, nextSlide) {
            }
        }
    };

});