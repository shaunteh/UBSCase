app.controller('ModalController', function ($scope, $modal) {
    $scope.animationsEnabled = true;

    $scope.open = function () {

        $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'notificationPrompt.html',
            controller: 'ModalInstanceCtrl',
        });

    };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $modal, $modalInstance) {

    $scope.yes = function () {

        $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'notificationSuccess.html',
            controller: 'ModalInstanceCtrl',
        });

        $modalInstance.close();

    };

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});