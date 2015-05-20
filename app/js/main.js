angular.module('starterapp', ['templates', 'ui.router', 'ngAnimate', 'ngMessages', 'uuid', 'ngCookies', 'ngSanitize'])
	.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('contacts', {
				url: '/',
				title: 'Contacts',

				views: {
					'': {
						templateUrl: '/templates/contacts/contacts.html'
					},
					'list@contacts': {
						controller: 'ContactsListController',
						templateUrl: '/templates/contacts/contacts.list.html'
                    },
                    'content@contacts': {
                        templateUrl: '/templates/contacts/contacts.content.html'
                    }
				}
			})
			.state('contacts.new', {
				url: 'contact/new',
				title: 'New Contact',

				views: {
					'content@contacts': {
						controller: 'ContactsNewController',
						templateUrl: '/templates/contacts/new/contacts.new.html'
					}
				}
			})
			.state('contacts.detail', {
				url: 'contact/{id}',
				title: 'Contact Detail',

				resolve: {
					contact: function($stateParams, ContactsService) {
						return ContactsService.findById($stateParams.id).then(function(data) {
							return data;
						});
					}
				},

				views: {
					'content@contacts': {
						controller: 'ContactsDetailsController',
						templateUrl: '/templates/contacts/detail/contacts.detail.html'
					}
				}
			})
			.state('contacts.detail.edit', {
				url: '/edit',

				views: {
					'content@contacts': {
						controller: 'ContactsDetailsController',
						templateUrl: '/templates/contacts/detail/contacts.edit.html'
					}
				}
			})
			.state('about', {
				url: '/about',
				controller: 'AboutController',
				templateUrl: '/templates/about/about.html',
				title: 'About'
			})
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: '/templates/login/login.html',
                title: 'Login'
            });

		$urlRouterProvider.otherwise('/');
	})
	.run(function ($rootScope, $state, $stateParams, $cookieStore, $http)
	{
		$rootScope.$on('$stateChangeSuccess', function(event, toState) {
			$rootScope.pageTitle = toState.title || '';
		});

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if ((toState.name === 'contacts') && !$rootScope.globals.currentUser) {
                event.preventDefault();
                $state.go('login');
            }
        });

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	});