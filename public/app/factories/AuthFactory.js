"use strict";

app.factory("AuthFactory", function(firebaseURL, $q, $http, $rootScope) {
  let currentUserData = null;

//Firebase: Determine if user is authenticated.
  let isAuthenticated = () => {
      return firebase.auth().currentUser ? true : false;
  };

//Firebase: Return email, UID for user that is currently logged in.
  let getUser = () => {
    return firebase.auth().currentUser;
  };

  let logout = () => {
    firebase.auth().signOut();
  }

//Firebase: Use input credentials to authenticate user.
  let authenticate = (credentials) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((authData) =>{
        resolve(currentUserData);
      })
      .catch((error)=>{
        reject(error);
      })
    });
  };


  let registerWithEmail = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((authData) =>{
        resolve(authData);
      })
      .catch((error)=>{
        reject(error);
      })
    });
  };

//Firebase: GOOGLE - Use input credentials to authenticate user.
  let authenticateGoogle = () => {
    return new Promise((resolve, reject) => {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((authData) => {
        currentUserData = authData.user;
        resolve(currentUserData);
      }).catch((error)=> {
        reject(error);
      })
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

  return {logout: logout, registerWithEmail:registerWithEmail, isAuthenticated:isAuthenticated, getUser:getUser, authenticate:authenticate, storeUser:storeUser, authenticateGoogle: authenticateGoogle};
});
