'use strict';

angular
    .module('myApp.expiredTasks', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/expired', {
            templateUrl: 'features/expired-tasks/expiredTasks.html',
            controller: 'ExpiredTasksCtrl'
        });
    }])
    .controller('ExpiredTasksCtrl', ExpiredTasksCtrl);

/**
 * @ngdoc controller
 * @module myApp
 * @name ExpiredTasksCtrl
 * @description ExpiredTasksCtrl controller function
 */

function ExpiredTasksCtrl() {
    var self = this;

    // Public Vars
    self.tasks = [];
    self.hasExpiredTasks = false;
    
    // initialize
    initialize();

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
     * Checks for any expired tasks
     * @return {Boolean}
     */
    function hasExpiredTasks() {
        angular.forEach(self.tasks, function(task) {
            if (task.remaining === 0) {
                self.hasExpiredTasks = true;
            }
        });
    }

    /**
     * Initialize the controller
     */
    function initialize() {
        if (!hasLocalStorage()) {
            alert('Please use a browser that supports localstorage or this app is useless.');
            return false;
        }

        // Get existing tasks from storage
        self.tasks = getLocalList();

        hasExpiredTasks();
    }
};