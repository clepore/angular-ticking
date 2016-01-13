Angular-ticking 
====================================================
Christopher Lepore

**An angular-based pomodoro-like task app**
Basically its a task app thats tied to a timer (all client side). Pomodoro timers are usually 25 minute intervals but for this demo they are varying durations in seconds.
(http://en.wikipedia.org/wiki/Pomodoro_Technique)

**The app features:**
- input form for creating a new task
- task list
- expired task list
- an alert when the task time as completed
- a start/stop button for the timer
- angular `controller as` syntax
- Bootstrap-css styles
- Karma/Jasmine unit tests for the controllers (cd into directory and run `npm test`)
- the ability to load sample tasks


**Future updates:**
- Re-factor some common controller functions into a shared utility service
- Re-factor getting/saving code into a shared data service with caching
- Ability to input the duration along with the task name
- Load code asynchronously (convenience of the angular-seeder template)




===============================
Templated from from: https://github.com/angular/angular-seed