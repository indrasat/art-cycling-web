(function () {
    'use strict';
    
    angular
        .module('schedule', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.schedule', {
                url: 'event',
                title: 'Event',
                templateUrl: '../views/event/event.html',
                controller: 'ScheduleCtrl as vm'
            });
    }
})();
 