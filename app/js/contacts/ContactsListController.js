angular.module('starterapp').controller('ContactsListController', function($scope, ContactsService, $state) {

    $scope.contacts = {};

    $scope.loadContacts = function() {
        $scope.dataLoading = true;
        ContactsService.findAll().then(function(data) {
            $scope.contacts = data;
            $scope.dataLoading = false;
            $state.go('contacts');
        });
    };

    $scope.addContact = function()
    {
        $state.go('contacts.new');
    };

    $scope.loadContacts();

    $scope.$on('refreshContacts',function(){
        $scope.loadContacts();
    });
});