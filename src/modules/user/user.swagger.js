/**
 * @swagger
 * tags:
 *  name: User
 *  description: User Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SendOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 */

/**
 * @swagger
 * /user/whoami:
 *  get:
 *      summary: gives the user info
 *      tags:
 *          -   User
 *      responses:
 *          200:
 *              description: success
 */