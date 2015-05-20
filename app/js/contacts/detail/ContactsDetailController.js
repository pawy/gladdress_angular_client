angular.module('starterapp').controller('ContactsDetailsController', function($scope, ContactsService, contact, $state, $rootScope) {
    $scope.contact = contact;


    $scope.delete = function() {
        if (confirm('Are you sure?')) {
            $scope.dataLoading = true;
            ContactsService.delete(contact)
            .success(function(data){
                $rootScope.$broadcast('refreshContacts');
                $state.go('contacts');
            })
            .error(function(data, status){
                $scope.dataLoading = false;
                var msg = data.Message;
                $scope.error = msg;
            });
        }
    };
});