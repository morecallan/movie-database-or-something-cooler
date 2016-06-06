"use strict";

app.factory("AuthFactory", function(firebaseURL, $q, $http, $rootScope) {
  let ref = new Firebase(firebaseURL);
  let currentUserData = null;

//Firebase: Determine if user is authenticated.
  let isAuthenticated = () => {
      let authData = ref.getAuth();
      return (authData) ? true : false;
  };

//Firebase: Return email, UID for user that is currently logged in.
  let getUser = () => {
    return currentUserData;
  };

//Firebase: Use input credentials to authenticate user.
  let authenticate = (credentials) => {
    return new Promise((resolve, reject) => {
      ref.authWithPassword({
        "email": credentials.email,
        "password": credentials.password
      }, (error, authData) => {
        if (error) {
          reject(error);
        } else {
          currentUserData = authData;
          resolve(authData);
        }
      });
    });
  };

//Firebase: Store each Firebase user's id in the `users` collection
  let storeUser = (authData) => {
    let stringifiedUser = JSON.stringify({ uid: authData.uid });
      return new Promise((resolve, reject) => {
        $http
          .post(`${firebaseURL}users.json`, stringifiedUser)
          .then(
            res => resolve(res),
            err => reject(err)
          );
      });
  };

  return {isAuthenticated:isAuthenticated, getUser:getUser, authenticate:authenticate, storeUser:storeUser};
});