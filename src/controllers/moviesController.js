const { sequelize } = require('../config/db');

// Get all movies
exports.getMovies = async (req, res) => {
    try {
        const [movies] = await sequelize.query(`SELECT * FROM movies`);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single movie by ID
exports.getMovieById = async (req, res) => {
    try {
        const [movie] = await sequelize.query(`SELECT * FROM movies WHERE id = ?`, {
            replacements: [req.params.id]
        });

        if (movie.length === 0) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new movie
exports.createMovie = async (req, res) => {
    try {
        const { name, publishYear } = req.body;
        const imageUrl = req.file ? `/assets/${req.file.filename}` : null;

        const [result] = await sequelize.query(
            `INSERT INTO movies (name, publishYear, imgURL) VALUES (?, ?, ?)`,
            { replacements: [name, publishYear, imageUrl] }
        );

        const [newMovie] = await sequelize.query(`SELECT * FROM movies WHERE id = ?`, {
            replacements: [result]
        });

        res.status(201).json(newMovie[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing movie
exports.updateMovie = async (req, res) => {
    try {
        const { name, publishYear } = req.body;
        const imageUrl = req.file ? `/assets/${req.file.filename}` : req.body.image;

        const [result] = await sequelize.query(
            `UPDATE movies SET name = ?, publishYear = ?, imgURL = ? WHERE id = ?`,
            { replacements: [name, publishYear, imageUrl, req.params.id] }
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie not found' });

        const [updatedMovie] = await sequelize.query(`SELECT * FROM movies WHERE id = ?`, {
            replacements: [req.params.id]
        });

        res.json(updatedMovie[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
    try {
        const [result] = await sequelize.query(`DELETE FROM movies WHERE id = ?`, {
            replacements: [req.params.id]
        });

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie not found' });

        res.json({ message: 'Movie deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
