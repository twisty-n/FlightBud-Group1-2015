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