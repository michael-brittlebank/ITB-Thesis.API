const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    //services
    mysqlService = require('../services/mysql');

let exerciseModel = {};

function mapToExerciseSchema(result){
    return {
        id: result.id,
        name: result.name,
        type: result.type
    };
}

function mapToWorkoutExerciseSchema(result){
    return {
        id: result.id,
        name: result.name,
        type: result.type,
        workoutId: result.workout_id,
        goalReps: result.goal_reps,
        goalSets: result.goal_sets,
        goalWeight: result.goal_weight,
        actualReps: result.actual_reps,
        actualSets: result.actual_sets,
        actualWeight: result.actual_weight
    };
}

exerciseModel.getExercises = function(){
    return mysqlService
        .select('exercises.*', 'exercise_type.name AS type')
        .from('exercises')
        .join('exercise_type','exercises.type_id', '=', 'exercise_type.id')
        .then(function (result){
            if (result) {
                return _.map(result, mapToExerciseSchema);
            } else {
                return result;
            }
        });
};

exerciseModel.getExercisesByWorkoutId = function(workoutId){
    return mysqlService()
        .select('workout_exercises.*', 'exercises.*', 'exercise_type.name AS type')
        .from('workout_exercises')
        .join('exercises','workout_exercises.exercise_id', '=', 'exercises.id')
        .join('exercise_type','exercises.type_id', '=', 'exercise_type.id')
        .where({
            workout_id: workoutId
        })
        .then(function (result){
            if (result) {
                return _.map(result, mapToWorkoutExerciseSchema);
            } else {
                return promise.reject(new Error('workoutModel.getExercisesByWorkoutId() Could not get workout exercise by workout id'));
            }
        });
};

module.exports = exerciseModel;