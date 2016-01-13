'use strict';

describe('ExpiredTasksCtrl', function() {
    var target;

    beforeEach(module('myApp.expiredTasks'));

    beforeEach(inject(function($controller) {
        target = $controller('ExpiredTasksCtrl');
    }));

    describe('When initializing the page and the browser supports localstorage', function() {
        it('should get the tasks', function() {
            expect(target.tasks).toBeDefined();
        });

        it('should check for expired tasks', function() {
            expect(target.hasExpiredTasks).toBeDefined();
        });
    });
});