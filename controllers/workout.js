const //packages
    _ = require('lodash'),
    //services
    utilService = require('../services/util'),
    logService = require('../services/log'),
    //models
    exerciseModel = require('../models/exercise'),
    workoutModel = require('../models/workout');

let workoutController = {};

workoutController.getExercises = function(req, res, next) {
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        exerciseModel.getExercises()
            .then(function(exercises){
                res.status(utilService.status.ok).json(exercises);
            })
            .catch(function(error){
                logService.error('userController.getExercises()',error);
                return next(error);
            });
    }
};

workoutController.getCurrentUsersWorkouts = function(req, res, next) {
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        workoutModel.getWorkoutsByUserId(req.user.id)
            .then(function(workouts){
                res.status(utilService.status.ok).json(workouts);
            })
            .catch(function(error){
                logService.error('userController.getWorkouts()',error);
                return next(error);
            });
    }
};

workoutController.saveWorkout = function(req, res, next) {
    req.checkBody('exercises', 'Exercises are required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        workoutModel.saveWorkout(req.user.id, req.body.exercises)
            .then(function(){
                res.status(utilService.status.ok).send('ok');
            })
            .catch(function(error){
                logService.error('userController.saveWorkout()',error);
                return next(error);
            });
    }
};


module.exports = workoutController;