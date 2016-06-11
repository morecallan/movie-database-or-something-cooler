"use strict";

var app = angular.module("MovieDatabaseApp", ["ngRoute", "focus-if", "slickCarousel", "ngAnimate"])
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
            resolve: {isAuth},
            reloadOnSearch: false
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

app.config(function($animateProvider) {
  $animateProvider.classNameFilter(/angular-animate/);
});



function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}


function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}


app.animation('.slide', [function() {
  return {
    // make note that other events (like addClass/removeClass)
    // have different function input parameters
    enter: function(element, doneFn) {
      jQuery(element).fadeIn(1000, doneFn);

      // remember to call doneFn so that angular
      // knows that the animation has concluded
    },

    move: function(element, doneFn) {
      jQuery(element).fadeIn(1000, doneFn);
    },

    leave: function(element, doneFn) {
      jQuery(element).fadeOut(1000, doneFn);
    }
  }
}]);