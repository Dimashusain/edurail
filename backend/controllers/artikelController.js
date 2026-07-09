const supabase = require("../config/supabase");


const getAllArtikel = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('artikel')
            .select('*')
            .order('tanggal', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getArtikelById = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from('artikel')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                message: 'Artikel tidak ditemukan'
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const createArtikel = async (req, res) => {
    try {

        const { judul, isi, tanggal } = req.body;

        const { data, error } = await supabase
            .from('artikel')
            .insert([
                {
                    judul,
                    isi,
                    tanggal
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Artikel berhasil ditambahkan',
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateArtikel = async (req, res) => {
    try {

        const { id } = req.params;
        const { judul, isi, tanggal } = req.body;

        const { data, error } = await supabase
            .from('artikel')
            .update({
                judul,
                isi,
                tanggal
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({
            message: 'Artikel berhasil diupdate',
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const deleteArtikel = async (req, res) => {
    try {

        const { id } = req.params;

        const { error } = await supabase
            .from('artikel')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            message: 'Artikel berhasil dihapus'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel
};