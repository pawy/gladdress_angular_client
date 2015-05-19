angular.module('starterapp').factory('ContactsService', function($http, rfc4122, Base64) {
	var factory = {};

	var customers = {};

	factory.findAll = function() {
        customers = $http.get('https://gladdress.azurewebsite.net/contacts/')
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
        return $http.delete('https://gladdress.azurewebsite.net/contacts/' + contact.GladId);
	};

	factory.create = function(newContactData) {
        return $http.post('https://gladdress.azurewebsite.net/contacts', {GladId:newContactData.GladId});
	};

	return factory;
});