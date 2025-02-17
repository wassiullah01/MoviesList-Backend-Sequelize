const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const moviesController = require("../controllers/moviesController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API endpoints related to movies
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved movie list
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, moviesController.getMovies);

/**
 * @swagger
 * /api/movies/view-movie/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve details of a specific movie using its ID.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved movie details
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Movie not found
 */
router.get("/view-movie/:id", authMiddleware, moviesController.getMovieById);

/**
 * @swagger
 * /api/movies/add-movie:
 *   post:
 *     summary: Add a new movie
 *     description: Create a new movie entry.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 example: "The Dark Knight"
 *               publishYear:
 *                 type: number
 *                 example: 2008
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request (Invalid input)
 */
router.post("/add-movie", authMiddleware, upload.single("file"), moviesController.createMovie);

/**
 * @swagger
 * /api/movies/update-movie/{id}:
 *   put:
 *     summary: Update an existing movie
 *     description: Modify the details of an existing movie using its ID.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 example: "Updated Movie Title"
 *               publishYear:
 *                 type: number
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Bad request (Invalid input)
 *       404:
 *         description: Movie not found
 */
router.put("/update-movie/:id", authMiddleware, upload.single("file"), moviesController.updateMovie);

/**
 * @swagger
 * /api/movies/delete-movie/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Remove a movie from the database using its ID.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */
router.delete("/delete-movie/:id", authMiddleware, moviesController.deleteMovie);

module.exports = router;