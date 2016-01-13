'use strict';

angular
    .module('myApp.tasks', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/tasks', {
            templateUrl: 'features/tasks/tasks.html',
            controller: 'TasksCtrl'
        });
    }])
    .controller('TasksCtrl', TasksCtrl); 

/**
 * @ngdoc controller
 * @module myApp
 * @name TasksCtrl
 * @description TasksCtrl controller function
 * @requires $http
 * @requires $timeout
 */

function TasksCtrl($http, $timeout) {
    var self = this;
    
    // Private Vars
    var _timerLen = 25, // seconds
        _decrement = 1, // seconds
        _timr = null;

    // Public Methods
    self.addTask = addTask;
    self.loadExamples = loadExamples;
    self.runTimer = runTimer;
    self.startTimer = startTimer;
    self.stopTimer = stopTimer;

    // initialize
    initialize();

    /**
     * @public
     * Adds an item to the array of items
     */
    function addTask() {
        if (self.taskName === '' || self.taskName === undefined) {
            alert('Task name has to be longer than 0 chars.');
            return false;
        } 

        var d = new Date(),
            timestamp = d.getTime(),
            task = {
                id: timestamp,
                name: self.taskName,
                date: timestamp,
                remaining: _timerLen
            };

        self.tasks.push(task);
        self.taskName = '';
        updateLocalList();
    }

    /**
     * Gets the list of items from localstorage
     * @return {Array} The array of items
     */
    function getLocalList() {
        var item = localStorage.getItem('taskTracker');
        if (item !== '' && item !== null) {
            return JSON.parse(item);
        }
        return [];  
    }

    /**
     * Tests whether the current browser supports localstorage
     * @return {Boolean}
     */
    function hasLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    /**
     * @public
     * Load example items
     */
    function loadExamples() {
        $http.get('data/examples.json').success(function(data) {
            self.tasks = data;
            updateLocalList(data);
        });
    }

    /**
     * @public
     * Run the timer for the item
     * @param  {Object} task The item object
     */
    function runTimer(task) {
        _timr = $timeout(function() {
            if (task.remaining === 0) {
                self.stopTimer(task);
                alert(task.name + ' is out of time!');
            } else {
                task.remaining = task.remaining - _decrement;
                self.countdown = task.remaining;
                self.runTimer(task);
            }
        }, _decrement * 1000);
    }

    /**
     * @public
     * Starts the timer for the item
     * @param  {Object} id The item
     */
    function startTimer(task) {
        if (!self.timerIsRunning) {
            task.isActive = self.timerIsRunning = true;
            self.countdown = task.remaining;
            self.runTimer(task);
        }
    }

    /**
     * @public
     * Starts the timer for the item
     * @param  {Object} id The item
     */
    function stopTimer(task) {
        if (self.timerIsRunning) {
            task.isActive = self.timerIsRunning = false;
            $timeout.cancel(_timr);
        }
        updateLocalList();
    }


    /**
     * Saves the current list of items to local storage
     */
    function updateLocalList() {
        localStorage.setItem('taskTracker', JSON.stringify(self.tasks));
    }

    /**
     * Initialize the controller
     */
    function initialize() {
        if (!hasLocalStorage()) {
            alert('Please use a browser that supports localstorage or this app is useless.');
            return false;
        }

        self.timerIsRunning = false;
        self.countdown = 0;  
        
        // Get existing tasks from storage or use sample data
        self.tasks = getLocalList();
    }
};