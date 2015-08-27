/// <reference path="../../typings/tsd.d.ts" />

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('dashboard', {
                url: '/dashboard/:flightId',
                params: {
                    flightId: -1    // Set default to -1 if none provided
                },
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {                    
                    flight: function(FlightsService, $stateParams) {
                        // Handle the no route case. Defaults to first flight
                        // TODO: test this logic works
                        if ($stateParams.flightId == -1) { return FlightsService.nextFlightToLeave(); }
                        return FlightsService.get($stateParams.flightId);
                    },
                    weather: function(WeatherService, FlightsService, $stateParams) {
                        var flightId = $stateParams.flightId;
                        return WeatherService.getAndUpdateWeatherSet
                        (
                                (flightId != -1) ? 
                                FlightsService.get(flightId).destination : 
                                FlightsService.nextFlightToLeave().destination
                        );
                    },
                    checklist: function(ChecklistService, $stateParams, FlightsService) {
                        var flightId = $stateParams.flightId;                        
                        return ChecklistService.retrieveChecklist(
                            (flightId != -1) ? 
                                flightId : 
                                FlightsService.nextFlightToLeave().id
                        );
                    }
                }
               
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'AuthCtrl'
            })

            .state('account', {
                url: '/account',
                templateUrl: 'templates/account.html',
                controller: 'AccountSettingsCtrl'
            })
            
            .state('all-flights', {
                url: '/flights',
                templateUrl: 'templates/flights.html',
                controller: 'FlightManagementCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(
            (
                (window.localStorage["userSettings"] == undefined) ? '/dash' :
                    (
                        (JSON.parse(window.localStorage["userSettings"]).landingPage != true) ?
                        '/flights' : '/dashboard'
                    )
            )
        ); // End otherwise
    });
