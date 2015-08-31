/// <reference path="../../typings/tsd.d.ts" />

angular.module('starter.services', [])

    .factory('OauthSignature', ['$window', function($window) {
        return $window.oauthSignature;
    }])

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        };
    }])
    
    .factory('ChecklistService', function($localstorage) {
        
        var newChecklist =  function() { 
            return { 
                categories: {
                    health: {
                                categoryName: "Health and Wellbeing",
                                categoryItems: [
                                    {
                                        name: "Organise your trip with FlightBud",
                                        completed: true	
                                    },
                                    {
                                        name: "Organise travel insurance",
                                        completed: false
                                    },
                                    {
                                        name: "Research destination medical advice",
                                        completed: false
                                    },
                                    {
                                        name: "Get all needed vaccinations",
                                        completed:  false
                                    }
                                ] 
                            },
                finance: 	{
                                categoryName: "Finances",
                                categoryItems: [
                                    {
                                        name: "Organise local currency",
                                        completed: false
                                    },
                                    {
                                        name: "Talk to financial institution about cards and currencies",
                                        completed: false
                                    }
                                ] 
                            },
                security: {
                                categoryName: "Security",
                                categoryItems: [
                                    {
                                        name: "Email trip details to self and family",
                                        completed: false
                                    },
                                    {
                                        name: "Copy and scan important documents such as passport, flight details, identification",
                                        completed: false
                                    }
                                ] 
                            },
                packing:  {
                                categoryName: "Things to Pack",
                                categoryItems: [
                                    {
                                        name: "Toothbrush and toiletries",
                                        completed: false
                                    },
                                    {
                                        name: "Electronics and chargers",
                                        completed: false
                                    },
                                    {
                                        name: "Camera and film/memory cards",
                                        completed: false
                                    },
                                    {
                                        name: "Camera and film/memory cards",
                                        completed: false
                                    },
                                    {
                                        name: "International adapters",
                                        completed: false
                                    }, 
                                    {
                                        name: "Gifts, business items or incedentals",
                                        completed: false
                                    },
                                    {
                                        name: "Phrase book and travel guide",
                                        completed: false
                                    }
                                ] 
                            },
                my_items:  {
                                categoryName: "My Items",
                                categoryItems: [
                                    {
                                        name: "Organise an adventure with FlightHub. Your travel experts!",
                                        completed: true
                                    }
                                ] 
                            }
                },
                completedItems: 0,
            };
        };
            
        var checklists = $localstorage.getObject("checklists");
        checklists.save = function() {
           $localstorage.setObject("checklists", checklists);
        };
        
        return {
            
            /**
             * Removes all currently saved checlists
             */
            clearCache: function() {
                checklists = {};
                $localstorage.setObject("checklists", {});
            },
            /**
             * Removes a given checklist
             */
            removeChecklist: function(flightId) {
                delete checklists[flightId];
                checklists.save();
            },
            /**
             * Returns a checklist bound to a flightId
             * If no checklist exists, then a checklist is created
             */
            retrieveChecklist: function(flightId) {
                
                if (checklists[flightId] == undefined) { 
                    checklists[flightId] = newChecklist();
                    checklists.save();
                 }
                 
                 var checklist = checklists[flightId];
                 
                 // Add methods to the checklist
                checklist.addItem = function(itemName) {
                    checklist.categories.my_items.categoryItems.push(
                        {
                                name: "Organise an adventure with FlightHub. Your travel experts!",
                                completed: true
                        }
                    );
                };
                // Will always fail. No removing items at the moment
                checklist.removeItem = function(item) {
                    return false;
                    //this.items.splice(this.items.indexOf(item), 1);
                };
                checklist.markAsComplete = function(itemName, itemCategory) {
                    var items = checklist.categories[itemCategory].categoryItems;
                    var length = items.length;
                    for (var i = 0; i<length; i++) {
                        if ( items[i].name == itemName && items[i].completed == false ) {
                            checklist.completedItems++;
                            items[i].completed = true;
                            break;
                        }
                    }
                };
                checklist.totalItems = function() {
                    return  checklist.categories.health.categoryItems.length      +
                            checklist.categories.finance.categoryItems.length    +
                            checklist.categories.security.categoryItems.length    +
                            checklist.categories.packing.categoryItems.length     +
                            checklist.categories.my_items.categoryItems.length;
                };
                checklist.completeItems = function() {
                    return checklist.completedItems;
                };
                checklist.remainingItems = function() {
                    return checklist.totalItems() - checklist.completeItems();
                };
                checklist.percentageComplete = function() {
                    return 100 * (checklist.completeItems() / checklist.totalItems());
                };
                return checklist;
            },
            saveChecklist: function(flightId, checklist) {
                checklists[flightId] = checklist;
                checklists.save();
            }
        }
        
    })
    
    .factory('FlightsService', function() {
        
        var flights = [
            {
                id: 1,
                price: 123.45,
                flight_time: 285, // I can't remember how we stored these, you can deal :P
                origin: 'Bangkok',
                destination: 'Washington DC',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "QF456",
                airline: 'Quantas'
            },
            
            {
                id: 2,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Quatar',
                destination: 'Perth',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "MH360",
                airline: 'Malaysia Airlines'
                
            },
            
            {
                id: 3,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Sydney',
                destination: 'New York',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "JQ69",
                airline: 'JetStar'
                
            },
            
            {
                id: 4,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Sydney',
                destination: 'Singapore',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "STI360",
                airline: 'STIFlight'
                
            }
        ]
        
        return {
            /*
            Returns all of the flights in the array
            */
            all: function () {
                return flights;
            },
            
            /*
            Removes a flight from the array
            */
            remove: function (chat) {
                flights.splice(flights.indexOf(chat), 1);
            },
            
            /**
             * Returns a flight from the array based on Id
             */
            get: function (chatId) {
                for (var i = 0; i < flights.length; i++) {
                    if (flights[i].id === parseInt(chatId)) {
                        return flights[i];
                    }
                }
                return null;
            },
            clearCache: function() {
                // Dump all
            },
            nextFlightToLeave: function() {
                // Assume its at the tip of the array
                return flights[0];
            }
        }
        
    })
    
    .factory('WeatherService', function($http, $localstorage, $log) {
        
        // This API will give us the weather for a particular location
        var openWeatherApi = "http://api.openweathermap.org/data/2.5/forecast?q=";
        
        // Cached weather stores the currently cached weather results for an array of countries
        var cachedWeather = $localstorage.getObject("cachedWeather");
        var saveWeather = function() {
           $localstorage.setObject("cachedWeather", cachedWeather);
        };
        
        // Returns true if a location is currently cached
        var inCache = function(location) {
          return cachedWeather[location] != undefined;  
        };
        
        var lookup = function(iconCode) {
            var iconName = "butts";
            // Inefficient IF cascade
            //if icon is clear sky
            if(iconCode == '01d' || iconCode == '01n') {
                iconName = 'clear';
            }
            //if icon is clouds
            if(iconCode == '02d' || iconCode == '02n' || iconCode == '03d' || iconCode == '03n' || iconCode == '04d' || iconCode == '04n') {
                iconName = 'clouds';
            }
            //if icon is rain
            if(iconCode == '09d' || iconCode == '09n' || iconCode == '10d' || iconCode == '10n') {
                iconName = 'rain';
            }
            //if icon is thunderstorm
            if(iconCode == '11d' || iconCode == '11n') {
                iconName = 'storm';
            }
            //if icon is snow
            if(iconCode == '13d' || iconCode == '13n') {
                iconName = 'snow';
            }
            //if icon is mist
            if(iconCode == '50d' || iconCode == '50n') {
                iconName = 'mist';
            }
            if (iconName == "butts") {
                iconName = "unknown";
            }
            iconName = "img/weather/" + iconName;
            iconName += '.png'
            return iconName;
        };
        
        /**
         * Returns a WeatherObject that encapsulates the weather for a location
         */
        var parseWeatherResponse = function(weatherJson) {
            var jsonObject = weatherJson;
            var weatherObject = {};
            weatherObject = // Create our own custom object
            {
                location: jsonObject.city.name,
                longitude: jsonObject.city.coord.lon,
                latitude: jsonObject.city.coord.lat,
                timeObtained: Date.now(),
                fiveDayForecast: [],
            }

            // Loop over 60 forcast items, grabbing the 0 - 48th 5 times to make
            // an approx weekly forecast, so we take the next most recont multiple of
            // 12
            var length = jsonObject.list.length
            for (var i=0; (i <= 48 && i < length); i++) {
                if ( i % 12 == 0 ) {
                    // Get this dataum and add it
                    var weatherDatum = jsonObject.list[i];
                    var d = Date.parse(weatherDatum.dt_txt);
                    var date = new Date(d);
                    weatherObject.fiveDayForecast.push
                    (
                        {
                            utcForecastTime: weatherDatum.dt_txt,
                            mainText: weatherDatum.weather[0].main,
                            description: weatherDatum.weather[0].description,
                            windSpeed: weatherDatum.wind.speed,
                            humidity: weatherDatum.main.humidity,
                            tempurature: weatherDatum.main.temp,
                            icon: lookup(weatherDatum.weather[0].icon),
                            displayDay: date.getDate()
                        }
                    ) // Close push
                }
            }
            
            // Reopen weatherObject
            weatherObject.currentWeather = weatherObject.fiveDayForecast[0];
            return weatherObject;
        };
        
        /**
         * Accepts a JSON response from the weather API and stores it 
         * in the weather cache
         */
        var parseAndStoreWeatherResponse = function(location, weatherJson) {
            var weatherObject = parseWeatherResponse(weatherJson);
            cachedWeather[location] = weatherObject;
            saveWeather();
        };
        
        var doUpdateWeatherSet = function(location) {
            var url = openWeatherApi + location;
                var log = $log;
                return $http.get(url).then( function(response) {
                    log.log
                    (
                        "Got weather for location: " 
                        + location
                        + " " + response.status
                        + " " + response.statusText
                        + " " + response.data
                    );
                    
                    if (response.data.cod == "404") {
                        return cachedWeather[location];
                    }
                    
                    parseAndStoreWeatherResponse(location, response.data);
                    return cachedWeather[location];
                }, function(error) {
                    log.log
                    (
                        "Error updating weather data " 
                        + error.status
                        + error.statusText 
                    );
                    return cachedWeather[location];
                });
        }
        
        return {
            
            /**
             * Returns cached weather data for a location
             * params:  location: the location to get
             * returns: A WeatherObject for the current location
             * or null if there is no object defined
             */
            getWeatherSet: function(location) {
                if (inCache(location)) {
                    return cachedWeather[location];
                } 
                return null;
                // Else we'll need to perform an update to get the vals
            },
            
            /**
             * Explicitly updates the weather set for a location
             */
            updateWeatherSet: function(location) {
                return doUpdateWeatherSet(location);
            },
            
            /**
             * Returns an updated weather set if we were able to update
             * or the most recent weather data
             * Will return null if we weren't able to get any data
             * This should be the main method called to get the weather set, 
             * as it will always return the most up to date information
             */
            getAndUpdateWeatherSet: function(location) {
                return doUpdateWeatherSet(location);
            },
            
            /**
             * Clears all cached weather data
             */
            clearCache: function() {
                cachedWeather = {};
                $localstorage.setObject("cachedWeather", {});
            }
            
        };
         
    })
    
    .factory('LocationInformationService', ['OauthSignature', 
                                            '$http', 
                                            '$localstorage', 
                                            '$log',
                                            '$q', 
    function (
        OauthSignature, 
        $http, 
        $localstorage,
        $log,
        $q,
        $window
    ) {
        
        // Prepare yourself for all of the fucking hax
        // Configure all of the values that we'll need to work with
        // In order to access the API
        
        var cachedListings = $localstorage.getObject("cachedListings", {});
        var saveAllListings = function() {
            $localstorage.setObject('cachedListings', cachedListings);
        }
        var callbackCount = angular.callbacks.counter;
        var method = 'GET';
        var url = 'http://api.yelp.com/v2/search';
        var randomString = function(length, chars) {
              var result = '';
                for (var i = length; i > 0; --i) {
                    result += chars[Math.round(Math.random() * (chars.length - 1))];
                } 
                return result;
        };
        var getParams = function(_location, _term) {
            return {
                callback: 'angular.callbacks._' + callbackCount,
                location: _location,                         // Need to set before use
                limit: '10',
                term: _term,                             // Need to set before use
                oauth_consumer_key: 'dCT_TJt3lI9tGVXLOSakFg', //Consumer Key
                oauth_token: 'PTCY-icFeGp-d3GAbwVrwg5_ZiwRazRT', //Token                
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: new Date().getTime(),                  // Need to set before use
                oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
            }
        };
        var consumerSecret = 'hf5p2RO2KcatJCAVaNJ9eJ1EnZs'; // Bad dev!
        var tokenSecret = 'xyBFeTMNREO8HkqJ9XotYlvkqzs';     // Bad dev!
        
        var parseYelpData = function(location, searchCategory, jsonObject) {
            if (cachedListings[location] == undefined) { cachedListings[location] = {}; }
            var businesses = jsonObject.businesses;
            var allListings = [];
            var busLength = businesses.length;
            for (var i=0; i < busLength; i++) {
                var business = businesses[i];
                var listing = {};
                listing.name = business.name;
                listing.image = business.image_url;
                listing.rating = business.rating;
                listing.url = business.mobile_url;
                listing.snippetText = business.snippet_text;
                listing.phoneNumber = business.display_phone;
                listing.address = business.location.display_address;
                listing.coordinates = {
                    latitude: business.location.coordinate.latitude,
                    longitude: business.location.coordinate.longitude
                }
                allListings.push(listing);
            }
            cachedListings[location][searchCategory] = allListings;
            saveAllListings();
            return allListings;
        };
        
        var getDataForLocationAndCategory = function(location, category) {
                var searchTerm = category;
                var params = getParams(
                    location.replace(" ", "+"), 
                    searchTerm
                );
                var signature = OauthSignature.generate(
                    method, url, 
                    params, consumerSecret, 
                    tokenSecret, {encodeSignature:false}
                );
                params['oauth_signature'] = signature;
                
                var callback = function(results) {
                    $log.log("Got information listing for " + location + ":"+ category);
                    delete this[params.callback];
                    return parseYelpData(location, category, results.data);
                }
                this[params.callback] = function (data) {
                    callback(data);
                };
                return $http.jsonp(url, {params: params}).then(function(results) {callback(results)}, function(data) {
                    $log.log("Data requested failed for " + location + ":" + category);
                    return null;
                });
        };
        
        // We are going to have to register our own magic functions to handle the callbacks
        /*var c = $window.angular.callbacks.counter.toString(36);

        $window['angularcallbacks_' + c] = function (data) {
            $window.angular.callbacks['_' + c](data);
            delete $window['angularcallbacks_' + c];
        };*/
        
        var searchTerms = [ "accomodation", "transportation", "dining", "entertainment" ]
        var fireQueries = function(location) {
            var array = searchTerms.map(function(term) {
                var promise = getDataForLocationAndCategory(location, term);
                callbackCount++; 
                return promise;
            });
            return array; 
        }
                
        return {

            clearCache: function() {
                // clear the cache of LocationInformation
                
            },
            
            /**
             * Returns an object containing the city listing information for a location
             * If the information was not able to be generated, method will
             * return null
             */
            getListingForCategory: function(location) {
                
                if (cachedListings[location] != undefined) {
                    return cachedListings[location];
                }
                
                // Do this shit if we don't have cached listings
                // We will do four call, one for each of the search categories
                return $q.all(fireQueries(location)).then(function(results) {
                    angular.callbacks.counter = 0;
                    callbackCount = angular.callbacks.counter;
                    return cachedListings[location];
                });
            },
            
            dealWithResponse: function(results) {
                
                // Do this shit if we don't have cached listings
                // We will do four call, one for each of the search categories
                return parseYelpData(null, null, results);
            }
        };
    }])