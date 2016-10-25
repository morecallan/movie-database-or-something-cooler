"use strict";


app.controller('LoginCtrl', function ($scope, $location, $rootScope, AuthFactory) {

    /********************************************
    **        Variables for PAGE VIEW          **
    ********************************************/

    $scope.userError = false;
    $scope.userEditMode = false;
    $scope.userUploadSuccess = false;


    $scope.closeModal = () => {
        $scope.userError = false;
    };


    if($location.path().includes("/login")){
        $rootScope.modeLogin = true;
    }

    if($location.path().includes("/register")){
        $rootScope.modeLogin = false;
    }


    $rootScope.account = {
        email: "",
        password: ""
    };

    if($location.path() === "/logout"){
        AuthFactory.logout();
        $rootScope.isActive = false;
    }


    $scope.register = () => {
      AuthFactory.registerWithEmail($rootScope.account.email, $rootScope.account.password)
        .then((userData)=> {
          $scope.login();
        })
        .catch((error) => {
          $scope.errorMessage = error.message;
          $scope.userError = true;
        })
    };


    $scope.login = () => {
        AuthFactory
        .authenticate($rootScope.account)
        .then((userCreds) => {
            $location.path("/watchlist");
            $scope.$apply();
            $rootScope.isActive = true;
        })
        .catch((error) => {
                $scope.errorMessage = error.message;
                $scope.userError = true;
        });
    };

    $scope.loginGoggle = () => {
        AuthFactory
        .authenticateGoogle()
        .then((userCreds) => {
            $location.path("/watchlist");
            $scope.$apply();
            $rootScope.isActive = true;
        })
        .catch((error) => {
            $scope.errorMessage = error.message;
            $scope.userError = true;
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
