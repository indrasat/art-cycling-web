(function () {
    'use strict';
    
    angular
        .module('contact', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.contact', {
                url: 'contact',
                templateUrl: '../views/about/about.html',
                controller: 'ContactCtrl as vm'
            });
    }
})();
  