angular.module('starter.controllers', [])

    .controller('FlightManagementCtrl', function($scope, $localstorage, $state, FlightsService) {
        
        $scope.flights = FlightsService.all();
        
    })

    .controller('NavigationCtrl', function ($scope, $localstorage, $state) {

        // Implement the navigation methods
        $scope.goToFlights = function () {
            $state.go('all-flights')
        };
        
        $scope.goToAccount = function() {
              $state.go('account')
        };
        
        $scope.goToDash = function() {
              $state.go('dashboard')
        };

    })

/****************************** DASHBOARD CONTROLLER *****************************/
    .controller('DashboardCtrl', function ($scope, $localstorage, $state, weather, flight, $log) {
    
        // If the user is not authenicated, redirect
        $scope.$on('$ionicView.enter', function (e) {

            // If this is the first time the app has been opened,
            // redirect to login, else show conversations page
            console.log("Test");
            if ($localstorage.get('userEmail', 'null') == 'null') {
                $state.go('login');
            } 
    
            // TODO: whenever we renter the view, refresh the content
        });
        
        $scope.flight = flight;
        $scope.weather = weather;
        $scope.currentWeatherView = weather.currentWeather;

        $scope.doRefresh = function () {
            // Do a network request to update if needed
            setTimeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        
        $scope.updateWeatherView = function(weatherIdentifier) {
            $log.log("Updating the weather view with weather unit" + weatherIdentifier);
            var newView = null;
            var weatherArray = $scope.weather.fiveDayForecast;
            for (var i=0; i < weatherArray.length; i++) {
                if ( weatherArray[i].utcForecastTime == weatherIdentifier ) {
                    newView = weatherArray[i];
                    break;
                }
            }
            $scope.currentWeatherView = newView;
        };
        

    })
/**************************** END DASHBOARD CONTROLLER ***************************/

/****************************************Imported**************************** */
/**
 * Handles all of the settings page
 */
    .controller('AccountSettingsCtrl', function (
        $scope, 
        $localstorage, 
        $state, 
        $log,
        $ionicPopup,
        FlightsService,
        WeatherService,
        LocationInformationService) {
    
        /**
         * On enter of this view, load the user settings
         */
        $scope.$on('$ionicView.enter', function (e) {
            $scope.settings = $localstorage.getObject("userSettings");
            $log.log("Entering settings page. Current settings: " + $scope.settings);
        });

        /**
         * On exit or this view, save the user settings
         */
        $scope.$on('$ionicView.leave', function (e) {
            $log.log($scope.settings);
            $localstorage.setObject("userSettings", $scope.settings);
        });
    
        /**
         * The logout function
         */
        $scope.logout = function () {
            $localstorage.set('userEmail', 'null');
            $localstorage.set('userPassword', 'null');
            $state.go('dashboard');
        };
        
        $scope.clearCache = function() {
            FlightsService.clearCache();
            WeatherService.clearCache();
            LocationInformationService.clearCache();
        };
        
        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Cache Clear',
                template: 'Are you sure you want to remove all cache information from device?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.clearCache();
                } else {
                   // Do nothing
                }
            });
        };
        
       
    })

/**
 * Handles all of the actions required to authenticate a user
 * with the FlightPub messaging API
 */
    .controller('AuthCtrl', function ($scope, 
        $log, 
        $localstorage, 
        $state, 
        $ionicViewService,
        $ionicNavBarDelegate) 
    {
            
        // Stop back bar appearing
        $ionicNavBarDelegate.showBar(false);        

        /**
         * Performs the user login and the initial application config
         */
        $scope.doLogin = function (userCredentials) {
        
            // Perform an API request
            // We'll need to have  a stub here
            // If successful, save the credenials, and return
            $log.log(userCredentials.email);
            $log.log(userCredentials.password);
            {
                // This will be in the callback
            
                // Save the user details to local storage
                $localstorage.set('userEmail', userCredentials.email);
                $localstorage.set('userPassword', userCredentials.password);
                
                // Make it so we can't go back to login
                $ionicViewService.nextViewOptions({
                    disableBack: true
                });
                
                // Set up initial app stuff
                if ($localstorage.get('firstOpen', "null") == "null") {
                    
                    // We really should defer this to some utiliy function, but whatever
                    $localstorage.set('firstOpen', false);
                    $localstorage.setObject("userSettings", {landingPage: true});
                    $localstorage.setObject("cachedWeather", {});
                    $state.go('dashboard');
                    
                } else {
                    // Just trust me
                    $state.go
                    (
                        (
                         $localstorage.getObject("userSettings").landingPage ? 'dashboard' : 'all-flights'   
                        ) 
                    )
                }
            }
            // Any device or sessoin key
            // else, signal error
            
            // Set up initial a
        
        }

    });
