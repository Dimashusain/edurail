const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const {
    getAllKereta,
    getKeretaById,
    createKereta,
    updateKereta,
    deleteKereta
} = require('../controllers/keretaController');

// PUBLIC
router.get('/', getAllKereta);
router.get('/:id', getKeretaById);

// ADMIN
router.post(
    '/',
    verifyToken,
    upload.single('gambar'),
    createKereta
);

router.put(
    '/:id',
    verifyToken,
    upload.single('gambar'),
    updateKereta
);

router.delete(
    '/:id',
    verifyToken,
    deleteKereta
);

module.exports = router;