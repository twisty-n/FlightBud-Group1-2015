angular.module('starter.controllers', [])

    .controller('FlightManagementCtrl', function($scope, $localstorage, $state, FlightsService) {
        
        if ($localstorage.get('userEmail', "null") == "null") {
                $state.go('login');
        }
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
    .controller('DashboardCtrl', function (
        $scope, $localstorage, 
        $state, weather, flight, $log, checklist, ChecklistService, 
        locationListing, $ionicModal, $window, ionic
    ){
    
        // If the user is not authenicated, redirect
        $scope.$on('$ionicView.enter', function (e) {

            // If this is the first time the app has been opened,
            // redirect to login, else show conversations page
            if ($localstorage.get('userEmail', "null") == "null") {
                $state.go('login');
            } 
            // TODO: whenever we renter the view, refresh the content
        });
        
        $scope.$on('$ionicView.leave', function (e) {
            ChecklistService.saveChecklist($scope.flight.id, $scope.checklist);
            flight = null;
            weather = null;
            $scope.currentWeatherView = null;
            $scope.viewLists = null;
            checklist = null;
        });
        
        // Actios for our modal
        $ionicModal.fromTemplateUrl('modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(listingId) {
            $scope.currentListingView.name
            $scope.modal.show();
            $scope.listingDetail = $scope.locationListing[$scope.currentListingView.name][listingId];
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
        
        $scope.openListingUrl = function() {
            $window.open($scope.listingDetail.url, '_system', 'location=yes');
            return false;
        }
        
        $scope.createMapsUrl = function(searchDevice, usingCoords) {
            if (usingCoords) {
                if (ionic.Platform.isAndroid()) {
                    // create android map string
                } else {
                    // Create IOS map string
                }
            } else {
                if (ionic.Platform.isAndroid()) {
                    // create android map string
                } else {
                    // Create IOS map string
                }
            }
        }
        
        // Set up variables
        $scope.flight = flight;
        
        $scope.prettyLength= function(length) {
            var minutes = (length % 60);
            var hours = parseInt((length / 60).toString());;
            return hours + 'h ' + minutes + 'm'; 
        }
        
        $scope.weather = weather;
        $scope.currentWeatherView = weather.currentWeather;
        $scope.locationListing = locationListing;
        $scope.currentListingView = { 
            name:"accomodation", list: locationListing.accomodation 
        };      
        
        $scope.changeListingView = function(requestedView) {
            $scope.currentListingView.name = requestedView;
            $scope.currentListingView.list = locationListing[requestedView];
        };
        
        $scope.cycleCurrentView = function(swipedLeft) {
            var currentView = $scope.currentListingView.name;
            if (currentView == 'entertainment') {
               swipedLeft ? 0 : $scope.changeListingView('transportation');
               return;
            }
            if (currentView == 'transportation') {
                swipedLeft ? $scope.changeListingView('entertainment') 
                : $scope.changeListingView('dining');
                return;
            }
            if (currentView == 'dining') {
                swipedLeft ? $scope.changeListingView('transportation') :
                $scope.changeListingView('accomodation');
                return;
            }
            swipedLeft ? $scope.changeListingView('dining') : 0;
 
        };
        
        // Checlist vars
        $scope.checklist = checklist; // The full checklist
        $scope.viewLists = {
            health: checklist.categories.health.categoryItems,
            finance: checklist.categories.finance.categoryItems,
            security: checklist.categories.security.categoryItems,
            packing: checklist.categories.packing.categoryItems,
            my_items: checklist.categories.my_items.categoryItems
        };
        
        $scope.cycleCurrentChecklist = function(swipedLeft) {
            if ($scope.currentCheckListView == 'all') {
                !swipedLeft ? $scope.showCompletedTasks() : 0;
                return;
            }
            if ($scope.currentCheckListView == 'completed') {
                swipedLeft ? $scope.showAllTasks() : 
                $scope.showPendingTasks();
                return
            }
            swipedLeft ? $scope.showCompletedTasks() : 0;
        };
        
        $scope.toggleListCategoryView = function(categoryKey) {
            $scope[categoryKey+"View"] = !$scope[categoryKey+"View"];
            var id = '#' + categoryKey;
            var elem = angular.element(document.querySelector(id))
            if (elem.hasClass('ion-arrow-right-c')) {
                elem.removeClass('ion-arrow-right-c');
                elem.addClass('ion-arrow-down-c');
            } else {
                elem.addClass('ion-arrow-right-c');
                elem.removeClass('ion-arrow-down-c');
            }
        };
        $scope.completeItem = function(itemName, category) {
            checklist.markAsComplete(itemName, category);
            $scope.refreshList();
        };
        
        $scope.refreshList = function() {
            if ($scope.currentCheckListView == 'all') {$scope.showAllTasks(); return;}
            if ($scope.currentCheckListView == 'pending') {$scope.showPendingTasks(); return;}
            if ($scope.currentCheckListView == 'completed') {$scope.showCompletedTasks(); return;}
        };
        
        $scope.currentCheckListView = 'all';
        $scope.showPendingTasks = function() {
            $scope.currentCheckListView = 'pending';
            $scope.viewLists = {
                health: checklist.categories.health.categoryItems.filter( function(item) { return item.completed == false; } ),
                finance: checklist.categories.finance.categoryItems.filter( function(item) { return item.completed == false; } ),
                security: checklist.categories.security.categoryItems.filter( function(item) { return item.completed == false; } ),
                packing: checklist.categories.packing.categoryItems.filter( function(item) { return item.completed == false; } ),
                my_items: checklist.categories.my_items.categoryItems.filter( function(item) { return item.completed == false; } )
            };
        },
        $scope.showCompletedTasks = function() {
            $scope.currentCheckListView = 'completed';
            $scope.viewLists = {
                health: checklist.categories.health.categoryItems.filter( function(item) { return item.completed != false; } ),
                finance: checklist.categories.finance.categoryItems.filter( function(item) { return item.completed != false; } ),
                security: checklist.categories.security.categoryItems.filter( function(item) { return item.completed != false; } ),
                packing: checklist.categories.packing.categoryItems.filter( function(item) { return item.completed != false; } ),
                my_items: checklist.categories.my_items.categoryItems.filter( function(item) { return item.completed != false; } )
            };
        },
        $scope.showAllTasks = function() {
            $scope.currentCheckListView = 'all';
            $scope.viewLists = {
                health: checklist.categories.health.categoryItems,
                finance: checklist.categories.finance.categoryItems,
                security: checklist.categories.security.categoryItems,
                packing: checklist.categories.packing.categoryItems,
                my_items: checklist.categories.my_items.categoryItems
            };
        },
        
        $scope.doTempConversion = function(temp) {
            if ($localstorage.getObject('userSettings').metric == true) {
                return Math.round(temp - 273.15) + '°C';
            } else {
            	return Math.round(((temp - 273.15) * 1.8) + 32) + '°F';
            }
        }
        
        $scope.prettyDay = function(day) {
            switch (day) {
                case 1:  ;
                case 21: ;
                case 31: return 'st'
                case 2:  ;
                case 22: return 'nd';
                case 3:  ;
                case 23: return 'rd';
                
                default: return 'th';
            }
        }

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
            $state.go('login');
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
        $scope.email = '';
        $scope.password = '';      

        /**
         * Performs the user login and the initial application config
         */
        $scope.doLogin = function () {
        
            // Perform an API request
            // We'll need to have  a stub here
            // If successful, save the credenials, and return
            var userCredentials = {};
            userCredentials.email = $scope.email;
            userCredentials.password = $scope.password
            $log.log(userCredentials.email);
            $log.log(userCredentials.password);
            {
                // This will be in the callback
            
                // Save the user details to local storage
                $localstorage.set('userEmail',      $scope.email);
                $localstorage.set('userPassword',   $scope.password);
                
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
                    $localstorage.setObject("cachedListings", {});
                    $localstorage.setObject("checklists", {});
                    $state.go('all-flights');
                    
                } else {
                    // Just trust me
                    $state.go
                    (
                        (
                          ($localstorage.getObject("userSettings").landingPage != true) ?
                        'all-flights' : 'dashboard'
                        ) 
                    )
                }
            }
            // Any device or sessoin key
            // else, signal error
            
            // Set up initial a
        
        }

    });
