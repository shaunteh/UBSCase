app.controller('ModalController', function ($scope, $modal) {
    $scope.animationsEnabled = true;

    $scope.open = function () {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'notify.html',
            controller: 'ModalInstanceCtrl'
        });
    };

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };
});