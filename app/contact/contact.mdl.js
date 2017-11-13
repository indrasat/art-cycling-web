(function () {
    'use strict';
    
    angular
        .module('contact', ['ngMap'])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.contact', {
                url: 'contact',
                templateUrl: '../views/contact/contact.html',
                controller: 'ContactCtrl as vm'
            });
    }
})();
  