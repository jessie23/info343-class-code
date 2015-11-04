/*
    script file for the index.html page
*/

angular.module('ContactsApp', ['ui.router', 'angular-uuid', 'LocalStorageModule'])
    .constant('storageKey', 'contacts-list')
    .factory('contacts', function(uuid, localStorageService, storageKey) { //needs to have same parameter name as constant
        return [{
            id: 'default-delete-me',
            fname: 'Fred',
            lname: 'Flinstone',
            phone: '206-555-1212',
            dob: '1/1/1900'
        }];
    })
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('list', {
                url: '/contacts',
                templateUrl: 'views/contacts-list.html',
                controller: 'ContactsController'
            })
             .state('detail', {
                url: '/contacts/:id',
                templateUrl: 'views/contact-detail.html',
                controller: 'ContactDetailController'
            })
            .state('edit', {
                url: '/contacts/:id/edit',
                templateUrl: 'views/edit-contact.html',
                controller: 'EditContactController'
            });

        $urlRouterProvider.otherwise('/contacts');
    })
    .controller('ContactsController', function($scope, contacts) {
        $scope.contacts = contacts;
    })
    .controller('ContactDetailController', function($scope, $stateParams, $state, contacts) {
        $scope.contact = contacts.find(function(contact) {
            return contact.id === $stateParams.id; //matches id in url under .state
        });
    })
    .controller('EditContactController', function($scope, $stateParams, $state, contacts) {
        var existingContact = contacts.find(function(contact) { //returns one contact out of the array
            return contact.id === $stateParams.id; //matches id in url under .state
        });

        $scope.contact = angular.copy(existingContact);

        $scope.save = function() {
            angular.copy($scope.contact, existingContact);
            $state.go('list');
        }
    });

