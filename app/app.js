"use strict";

var app = angular.module("MovieDatabaseApp", ["ngRoute"])
    .constant("firebaseURL", "https://supercoolmoviedb.firebaseio.com/");

let isAuth = (AuthFactory) => new Promise((resolve, reject) => {
    if (AuthFactory.isAuthenticated()) {
        resolve();
    } else {
        reject();    
    }
});

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/test.html",
            controller:  "ListEditCtrl",
            resolve: {isAuth}
        })
        .when("/results", {
            templateUrl: "partials/list.html",
            controller:  "ListExternalCtrl",
        })
        .when("/list",{
            templateUrl: "partials/watchList.html",
            controller:  "ListExternalCtrl",
        })
        .when("/search", {
            templateUrl: "partials/search.html",
            controller:  "SearchExternalCtrl",
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
    let contactRef = new Firebase("https://supercoolmoviedb.firebaseio.com/");
    contactRef.unauth();

    contactRef.onAuth(authData => {
        if(!authData) {
            $location.path("/search");
        }
    })
});