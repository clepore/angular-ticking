'use strict';

describe('TasksCtrl', function() {
    var timeout,
        target;

    // Spies
    var httpSpy,
        httpSuccessSpy;

    beforeEach(module('myApp.tasks'));

    beforeEach(inject(function($controller, $timeout) {
        timeout = $timeout;

        httpSpy = jasmine.createSpyObj('http', ['get']);

        httpSuccessSpy = jasmine.createSpy('httpSuccess');
        httpSpy.get.and.returnValue({
            success: httpSuccessSpy
        });

        target = $controller('TasksCtrl', {
            $http: httpSpy,
            $timeout: timeout
        });
    }));

    describe('When initializing the page and the browser supports localstorage', function() {
        it('should initialize the countdown to 0', function() {
            expect(target.countdown).toEqual(0);
        });

        it('should show all timers as stopped', function() {
            expect(target.timerIsRunning).toBeFalsy();
        });

        it('should get the tasks', function() {
            expect(target.tasks).toBeDefined();
        });
    });


    /**
     * addTask;
     */
    
    describe('When adding a task', function() {
        
        describe('and there isn\'t a task name', function() {
            var result;

            beforeEach(function() {
                spyOn(window, 'alert').and.callFake(function() {});
                self.taskName = '';
                result = target.addTask();
            });

            it('should show an alert', function() {
                expect(alert).toHaveBeenCalledWith('Task name has to be longer than 0 chars.');
            });

            it('should stop', function() {
                expect(result).toBeFalsy();
            });
        });

        describe('and there is a task name', function() {
            beforeEach(function() {
                target.tasks = [];
                target.taskName = 'TASKNAME';
                target.addTask();
            });

            it('should add the new task to the list', function() {
                expect(target.tasks.length).toEqual(1);
            });

            it('should reset the input', function() {
                expect(target.taskName).toEqual('');
            });
        });
    });


    /**
     * loadExamples;
     */
    
    describe('When loading examples', function() {
        beforeEach(function() {
            self.tasks = [];
            target.loadExamples();
            httpSuccessSpy.calls.argsFor(0)[0]([{ id: 1 }]);
        });

        it('should call the http service', function() {
            expect(httpSpy.get).toHaveBeenCalledWith('data/examples.json');
        });

        it('should get the example data', function() {
            expect(target.tasks).toEqual([{ id: 1 }]);
        });
    });
    

    /**
     * runTimer;
     */
    
    describe('When running the timer', function() {
        var task = {
            id: 1,
            name: 'TEST',
            remaining: 5
        };

        describe('and the timer isn\'t at 0', function() {
            beforeEach(function() {
                target.countdown = 5;
                target.runTimer(task);
                timeout.flush();
            });

            it('should decrement the time remaining by 1 second', function() {
                expect(target.countdown).toEqual(4);
            });
        });

        describe('and the timer runs out', function() {
            beforeEach(function() {
                spyOn(window, 'alert').and.callFake(function() {});
                spyOn(target, 'stopTimer').and.callFake(function() {});
                task.remaining = 0;
                target.runTimer(task);
                timeout.flush();
            });

            it('should stop the timer', function() {
                expect(target.stopTimer).toHaveBeenCalledWith(task);
            });

            it('should show an alert', function() {
                expect(alert).toHaveBeenCalledWith('TEST is out of time!');
            });
        });
    });
    

    /**
     * startTimer;
     */
    
    describe('When starting the timer', function() {
        var task = {
            id: 1,
            name: 'TEST',
            remaining: 5,
            isActive: false
        };

        describe('and there isn\'t a timer running', function() {
            beforeEach(function() {
                target.timerIsRunning = false;
                spyOn(target, 'runTimer').and.callFake(function() {});
                target.startTimer(task);
            });

            it('should set the task as active', function() {
                expect(task.isActive).toBeTruthy();
                expect(target.timerIsRunning).toBeTruthy();
            });

            it('should the global clock to the time remaining', function() {
                expect(target.countdown).toEqual(5);
            });

            it('should run the timer', function() {
                expect(target.runTimer).toHaveBeenCalledWith(task);
            });
        });

        describe('and there is a timer running', function() {
            beforeEach(function() {
                spyOn(target, 'runTimer').and.callFake(function() {});

                target.timerIsRunning = true;
                target.startTimer(task);
            });

            it('should not run the timer', function() {
                expect(target.runTimer).not.toHaveBeenCalledWith();
            });
        });
    });
    
    /**
     * stopTimer;
     */
    
    describe('When stopping the timer', function() {
        var task = {
            id: 1,
            name: 'TEST',
            remaining: 5,
            isActive: true
        };

        describe('and there is a timer running', function() {
            beforeEach(function() {
                spyOn(timeout, 'cancel').and.callFake(function() {});
                target.timerIsRunning = true;
                target.stopTimer(task);
            });

            it('should set the task as inactive', function() {
                expect(task.isActive).toBeFalsy();
                expect(target.timerIsRunning).toBeFalsy();
            });

            it('should stop the timer', function() {
                expect(timeout.cancel).toHaveBeenCalled();
            });
        });
    });
});