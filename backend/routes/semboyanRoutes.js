const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const {
    getAllSemboyan,
    getSemboyanById,
    createSemboyan,
    updateSemboyan,
    deleteSemboyan
} = require('../controllers/semboyanController');

// PUBLIC
router.get('/', getAllSemboyan);
router.get('/:id', getSemboyanById);

// ADMIN
router.post(
    '/',
    verifyToken,
    upload.single('gambar'),
    createSemboyan
);

router.put(
    '/:id',
    verifyToken,
    upload.single('gambar'),
    updateSemboyan
);

router.delete(
    '/:id',
    verifyToken,
    deleteSemboyan
);

module.exports = router;