const // packages
    express = require('express'),
    router = express.Router(),
//controllers
    adminController = require('../controllers/admin');

/**
 * @swagger
 * /admin/users/{page}/{limit}:
 *   get:
 *     tags:
 *       - Admin
 *     description: Returns paginated list of users
 *     parameters:
 *       - in: path
 *         name: page
 *         type: integer
 *         required: true
 *         description: Page of results to get.
 *       - in: path
 *         name: limit
 *         type: integer
 *         required: true
 *         description: Number of results to get per page.
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: "#/definitions/User"
 *       401:
 *         description: Unauthorized
 */
router.route('/users/:page/:limit')
    .get(adminController.getUsers);

router.route('/user/:id')
    .delete(adminController.deleteUser);

module.exports = router;
