"use strict";

var app = angular.module("MovieDatabaseApp", ["ngRoute"])
    .constant("firebaseURL","https://supercoolmoviedb.firebaseio.com/");

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
        .when("/register", {
            templateUrl: "partials/search.html",
            controller:  "SearchExternalCtrl"
        })
        .when("/login", {
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
            $location.path("/login");
        }
    })
});