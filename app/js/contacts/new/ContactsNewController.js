angular.module('starterapp').controller('ContactsNewController', function($scope, ContactsService, $state, $rootScope) {
	$scope.contact = {};

	$scope.cancel = function() {
		$state.go('contacts');
	};

	$scope.create = function() {
        $scope.dataLoading = true;
        ContactsService.create($scope.contact)
            .success(function(data){
                $rootScope.$broadcast('refreshContacts');
                $state.go('contacts',{id: data.GladId});
            })
            .error(function(data, status){
                $scope.dataLoading = false;
                var msg = data.Message;
                switch(status)
                {
                    case 404:
                        msg = "glad-card not found";
                        break;
                }
                $scope.error = msg;
            });
	};
});