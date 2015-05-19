angular.module('starterapp').factory('ContactsService', function($http, rfc4122, Base64) {
	var factory = {};

	var customers = {};

	factory.findAll = function() {
        customers = $http.get('https://gladdress.azurewebsites.net/contacts/')
            .then(function(response) {
                return response.data;
            });
		return customers;
	};

	factory.findById = function(id) {
		return customers.then(function(data) {
            return _.find(data, {GladId: id});
		});
	};

	factory.delete = function(contact) {
        return $http.delete('https://gladdress.azurewebsites.net/contacts/' + contact.GladId);
	};

	factory.create = function(gladId) {
        return $http.post('https://gladdress.azurewebsites.net/contacts', {GladId:gladId});
	};

	return factory;
});