angular.module('starterapp').controller('ContactsNewController', function($scope, ContactsService, $state, $rootScope) {
	$scope.contact = {};

	$scope.cancel = function() {
		$state.go('contacts');
	};

	$scope.create = function() {
        $scope.dataLoading = true;
        var gladId = $scope.contact.GladId;
        if(gladId.indexOf('http') == 0) {
            gladId = gladId.match('http[s]?\:\/\/(www\.)?gladdress\.com\/(.*)\.html')[2];
        }
        ContactsService.create(gladId)
            .success(function(){
                $rootScope.$broadcast('refreshContacts',gladId);
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