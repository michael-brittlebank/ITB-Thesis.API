SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `exercise_muscle_groups` (
  `exercise_id` int(11) NOT NULL,
  `primary_muscle_group_id` int(11) NOT NULL,
  `secondary_muscle_group_id` int(11) NOT NULL,
  KEY `exercise_id` (`exercise_id`,`primary_muscle_group_id`,`secondary_muscle_group_id`),
  KEY `primary_muscle_group_id` (`primary_muscle_group_id`),
  KEY `secondary_muscle_group_id` (`secondary_muscle_group_id`),
  CONSTRAINT `exercise_muscle_groups_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  CONSTRAINT `exercise_muscle_groups_ibfk_2` FOREIGN KEY (`primary_muscle_group_id`) REFERENCES `primary_muscle_groups` (`id`),
  CONSTRAINT `exercise_muscle_groups_ibfk_3` FOREIGN KEY (`secondary_muscle_group_id`) REFERENCES `secondary_muscle_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `exercise_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `exercise_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `primary_muscle_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `secondary_muscle_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `user_roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `workout_exercises` (
  `workout_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `goal_reps` int(11) NOT NULL,
  `goal_sets` int(11) NOT NULL,
  `goal_weight` int(11) NOT NULL,
  `actual_reps` int(11) NOT NULL,
  `actual_sets` int(11) NOT NULL,
  `actual_weight` int(11) NOT NULL,
  KEY `workout_id` (`workout_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `workout_exercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`),
  CONSTRAINT `workout_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `workouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
