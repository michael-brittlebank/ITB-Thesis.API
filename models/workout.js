const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    //services
    mysqlService = require('../services/mysql');

let workoutModel = {};

function mapToSchema(result){
    return {
        id: result.id,
        userId: result.user_id,
        dateCreated: result.date_created
    };
}

workoutModel.getWorkoutsByUserId = function(userId){
    return mysqlService
        .select('*')
        .from('workouts')
        .where({
            user_id: userId
        })
        .then(function (result){
            if (result) {
                return _.map(result, mapToSchema);
            } else {
                return result;
            }
        });
};

workoutModel.getMostRecentWorkoutByUserId = function(userId){
    return mysqlService
        .select('*')
        .from('workouts')
        .where({
            user_id: userId
        })
        .orderBy('id', 'desc')
        .limit(1)
        .then(function (result){
            result = result[0];
            if (result) {
                return mapToSchema(result);
            } else {
                return result;
            }
        });
};

workoutModel.createWorkout = function(userId){
    return mysqlService('workouts')
        .insert({
            user_id: userId
        })
        .then(function (result){
            result = result[0];
            if (result) {
                return workoutModel.getMostRecentWorkoutByUserId(userId);
            } else {
                return promise.reject(new Error('workoutModel.createWorkout() Could not create workout'));
            }
        });
};

workoutModel.saveWorkoutExercise = function(workoutId, exercise){
    return mysqlService('workout_exercises')
        .insert({
            workout_id: workoutId,
            exercise_id: exercise.id,
            actual_reps: exercise.actualReps
        })
        .then(function (result){
            if (result) {
                return result;
            } else {
                return promise.reject(new Error('workoutModel.saveWorkoutExercise() Could not save workout exercise'));
            }
        });
};

workoutModel.saveWorkout = function(userId, exercises){
    return workoutModel.createWorkout(userId)
        .then(function(workout){
            let promises = _.map(exercises,function(exercise){
                return workoutModel.saveWorkoutExercise(workout.id,exercise);
            });
            return promise.all(promises)
                .then(function(results){
                    return results;
                });
        })
        .catch(function(){
            return promise.reject(new Error('workoutModel.saveWorkout() Could not save workout'));
        });
};

module.exports = workoutModel;