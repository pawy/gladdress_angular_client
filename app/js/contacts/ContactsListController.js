angular.module('starterapp').controller('ContactsListController', function($scope, ContactsService, $state) {

    $scope.contacts = [];
    $scope.dataLoading = true;

    ContactsService.getAll().then(function(data) {
        $scope.contacts = data;
        $scope.dataLoading = false;
    });

    $scope.loadContacts = function(gladId) {
        $scope.contacts = [];
        $scope.dataLoading = true;
        ContactsService.getAll(true).then(function(data) {
            $scope.contacts = data;
            $scope.dataLoading = false;
            if(gladId) {
                $state.go('contacts.detail',{id: gladId});
            }
        });
    };

    $scope.addContact = function()
    {
        $state.go('contacts.new');
    };

    $scope.loadContacts();

    $scope.$on('refreshContacts',function(e, gladId){
        $scope.loadContacts(gladId);
    });
});