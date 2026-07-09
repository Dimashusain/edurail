const express = require('express');
const router = express.Router();

const verifyToken =
require('../middleware/authMiddleware');

const {
    getAllArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel
} = require('../controllers/artikelController');

router.get('/', getAllArtikel);
router.get('/:id', getArtikelById);

router.post('/', verifyToken, createArtikel);
router.put('/:id', verifyToken, updateArtikel);
router.delete('/:id', verifyToken, deleteArtikel);

module.exports = router;