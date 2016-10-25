"use strict";

app.factory('httpInterceptor', function ($q, $rootScope, $log) {
    let numLoadings = 0;

    let request = (config) => {
        numLoadings++;
        // Show loader
        $rootScope.$broadcast("loader_show");
        return config || $q.when(config);
    };

    let response = (response) => {
        if ((--numLoadings) === 0) {
            // Hide loader
            $rootScope.$broadcast("loader_hide");
        }
        return response || $q.when(response);
    };

    let responseError = (response) => {
        if (!(--numLoadings)) {
            // Hide loader
            $rootScope.$broadcast("loader_hide");
        }
        return $q.reject(response);
    };

    return {request:request, response:response, responseError:responseError};
})

.config(($httpProvider) => {
    $httpProvider.interceptors.push('httpInterceptor');
});

app.directive("loader", ($rootScope) => {
    return ($scope, element, attrs) => {
        $scope.$on("loader_show", () => {
            return element.show();
        });
        return $scope.$on("loader_hide", () => {
            return element.hide();
        });
    };
});