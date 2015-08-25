/// <reference path="../../typings/tsd.d.ts" />

angular.module('starter.services', [])

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
        }
    }])
    
    .factory('UserFlights', function() {
        
        var flights = [
            {
                id: 1,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Bangkok',
                destination: 'Singapore',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "JQ456"
            },
            
            {
                id: 2,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Bangkok',
                destination: 'Singapore',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "JQ456"
            },
            
            {
                id: 3,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Bangkok',
                destination: 'Singapore',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "JQ456"
            },
            
            {
                id: 4,
                price: 123.45,
                flight_time: 180, // I can't remember how we stored these, you can deal :P
                origin: 'Bangkok',
                destination: 'Singapore',
                departureTime: 12.45,       // Mocked for now. Deal with same as Ember
                arrivalTime: 8.46,
                flightCode: "JQ456"
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
            }
        }
        
    })
    
    .factory('Weather', function($http, $localstorage, $log) {
        
        // This API will give us the weather for a particular location
        var openWeatherApi = "http://api.openweathermap.org/data/2.5/forecast?q=";
        
        // Cached weather stores the currently cached weather results for an array of countries
        var cachedWeather = $localstorage.getObject("cachedWeather");
        cachedWeather.save = function() {
           $localstorage.setObject("cachedWeather", cachedWeather);
        }
        
        // Returns true if a location is currently cached
        var inCache = function(location) {
          return cachedWeather[location] != undefined;  
        };
        
        var lookup = function(iconCode) {
            var iconName = "butts";
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
            iconName = "img/" + iconName;
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
                longitude: jsonObject.city.coord.lon,
                latitude: jsonObject.city.coord.lat,
                timeObtained: Date.now(),
                fiveDayForecast: [],
            }

            // Loop over 60 forcast items, grabbing the 0 - 48th 5 times to make
            // an approx weekly forecast, so we take the next most recont multiple of
            // 12
            for (var i=0; (i <= 48 && i < jsonObject.list.length) ; i++) {
                if ( i % 12 == 0 ) {
                    // Get this dataum and add it
                    var weatherDatum = jsonObject.list[i];
                    weatherObject.fiveDayForecast.push
                    (
                        {
                            utcForecastTime: weatherDatum.dt_txt,
                            mainText: weatherDatum.weather[0].main,
                            description: weatherDatum.weather[0].description,
                            minTempurature: weatherDatum.main.temp_min,
                            maxTempurature: weatherDatum.main.temp_max,
                            tempurature: weatherDatum.main.temp,
                            icon: lookup(weatherDatum.weather[0].icon)
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
            cachedWeather.save();
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
                        return false;
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
                    return null;
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
            
        }
        
        
    })