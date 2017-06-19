const // packages
    express = require('express'),
    router = express.Router(),
//controllers
    workoutController = require('../controllers/workout');

router.route('/')
    .get(workoutController.getCurrentUsersWorkouts)
    .put(workoutController.saveWorkout);

router.route('/exercises')
    .get(workoutController.getExercises);

router.route('/:workoutId')
    .get(workoutController.getWorkout);

module.exports = router;
