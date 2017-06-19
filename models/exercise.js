const //packages
    _ = require('lodash'),
    //services
    mysqlService = require('../services/mysql');

let exerciseModel = {};

function mapToSchema(result){
    return {
        id: result.id,
        name: result.name,
        type: result.type
    };
}

exerciseModel.getExercises = function(){
    return mysqlService
        .select('exercises.*', 'exercise_type.name AS type')
        .from('exercises')
        .join('exercise_type','exercises.type_id', '=', 'exercise_type.id')
        .then(function (result){
            if (result) {
                return _.map(result, mapToSchema);
            } else {
                return result;
            }
        });
};

module.exports = exerciseModel;