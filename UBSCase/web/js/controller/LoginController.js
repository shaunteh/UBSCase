app.controller('LoginController', function($scope, $location, $rootScope, UserService, $http, Session) {
    $scope.credentials = {
        username: "", password: ""
    };

    $scope.result = "";

    $scope.register = function() {
        $location.path("register");
    };

    $scope.authenticateUser = function() {

        UserService.authenticate($scope.credentials).then(function(res) {
            console.log(res);
            if (res.status === 200) {
                //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                init();
                var user = res.data;
                Session.create(user.id, user.firstName, user.lastName, user.email, user.account_type);
                $rootScope.setCurrentUser(user); 
                $location.path("dashboard");
            } else {
                $scope.result = "Invalid username / password!";
                $scope.$digest();
                $location.path("login");
            }
        }, function() {
            //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
    
    init = function() {
        $http.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
        $http.defaults.xsrfCookieName = 'CSRF-TOKEN';
    };
});