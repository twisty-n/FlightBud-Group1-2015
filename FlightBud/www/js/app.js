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
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                window.cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleLightContent();
            }
            window.localStorage['userEmail'] = 'email';
            window.localStorage['userPassword'] = 'password';
        });
    })
    
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


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
                    flight: function(FlightPubService, $stateParams) {
                        // Handle the no route case. Defaults to first flight
                        // TODO: test this logic works
                        if ($stateParams.flightId == -1) { return FlightPubService.nextFlightToLeave(); }
                        return FlightPubService.get($stateParams.flightId);
                    },
                    weather: function(WeatherService, FlightPubService, $stateParams) {
                        var flightId = $stateParams.flightId;
                        return WeatherService.getAndUpdateWeatherSet
                        (
                                (flightId != -1) ? 
                                FlightPubService.get(flightId).destination : 
                                FlightPubService.nextFlightToLeave().destination
                        );
                    },
                    checklist: function(ChecklistService, $stateParams, FlightPubService) {
                        var flightId = $stateParams.flightId;                        
                        return ChecklistService.retrieveChecklist(
                            (flightId != -1) ? 
                                flightId : 
                                FlightPubService.nextFlightToLeave().id
                        );
                    },
                    locationListing: function(LocationInformationService, $stateParams, FlightPubService) {
                        var flightId = $stateParams.flightId;
                        var destination  =  ((flightId != -1) ? 
                                FlightPubService.get(flightId).destination : 
                                FlightPubService.nextFlightToLeave().destination);
                        return LocationInformationService.getListingForCategory(destination);
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
                controller: 'FlightManagementCtrl',
                params: {
                    forceRefresh: false    // Set default to -1 if none provided
                },
                resolve: {
                    flights: function(FlightPubService, $stateParams) {
                        return FlightPubService.loadUpcomingFlights($stateParams.forceRefresh);
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(
            (
                (window.localStorage["userSettings"] == undefined) ? '/dashboard' :
                    (
                        (JSON.parse(window.localStorage["userSettings"]).landingPage != true) ?
                        '/flights' : '/dashboard'
                    )
            )
        ); // End otherwise
    });
   
