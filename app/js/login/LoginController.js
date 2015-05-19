angular.module('starterapp').controller('LoginController',
        function ($scope, $rootScope, $state, AuthenticationService) {
            // reset login status
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.password, function(response)
                {
                    if(response === true) {
                        AuthenticationService.SetCredentials($scope.username, $scope.password);
                        $state.go('contacts');
                    } else {
                        $scope.error = response.Message;
                        $scope.dataLoading = false;
                    }
                });
            };
        });