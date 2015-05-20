angular.module('starterapp').factory('ContactsService', function($http, rfc4122, Base64) {
	var factory = {};

	var contacts = $http.get('https://gladdress.azurewebsites.net/contacts/')
        .then(function(response) {
            return response.data;
        });

	factory.getAll = function(reload) {
        if(reload) {
            return $http.get('https://gladdress.azurewebsites.net/contacts/')
                .then(function(response) {
                    return response.data;
                });
        }
		return contacts;
	};

	factory.getById = function(id) {
		return contacts.then(function(data) {
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