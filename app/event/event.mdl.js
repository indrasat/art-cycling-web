(function () {
    'use strict';
    
    angular
        .module('event', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.event', {
                url: 'event',
                templateUrl: '../views/event/event.html',
                controller: 'EventCtrl as vm'
            });
    }
})();
  