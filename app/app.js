"use strict";

var app = angular.module("MovieDatabaseApp", ["ngRoute", "focus-if", "slickCarousel"])
    .constant("firebaseURL", "https://supercoolmoviedb.firebaseio.com/");

let isAuth = (AuthFactory) => new Promise((resolve, reject) => {
    if (AuthFactory.isAuthenticated()) {
        resolve();
    } else {
        reject();    
    }
});

app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src !== attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
});

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/watchList.html",
            controller:  "ListExternalCtrl",
            resolve: {isAuth}
        })
        .when("/search", {
            templateUrl: "partials/list.html",
            controller:  "ListExternalCtrl",
            resolve: {isAuth}
        })
        .when("/results", {
            templateUrl: "partials/list.html",
            controller:  "ListExternalCtrl",
            resolve: {isAuth}
        })
        .when("/watchlist",{
            templateUrl: "partials/watchlist.html",
            controller:  "ListExternalCtrl",
            resolve: {isAuth}
        })
        .when("/login", {
            templateUrl: "partials/login-reg.html",
            controller:  "LoginCtrl"
        })
        .when("/logout",{
            templateUrl: "partials/login-reg.html",
            controller:  "LoginCtrl"
        })
        .when("/register", {
            templateUrl: "partials/login-reg.html",
            controller:  "LoginCtrl"
        })
        .otherwise("/"); 
});

app.run(($location) => {
    let watchlistRef = new Firebase("https://supercoolmoviedb.firebaseio.com/");
    watchlistRef.unauth();

    watchlistRef.onAuth(authData => {
        if(!authData) {
            $location.path("/login");
        }
    });
});