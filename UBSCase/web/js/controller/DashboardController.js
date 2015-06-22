app.controller('DashboardController', function($scope, $location, $rootScope, UserService, Session) {
    $scope.logout = function() {
        Session.destroy();
        $rootScope.removeCurrentUser();
        console.log("DashboardController logout Clicked");
        UserService.logout().then(function() {
            console.log("Successfully logged out");
            $location.path("/UBSCase/");
        }, function(res) {
            console.log("Error Value");

        });
    };

});