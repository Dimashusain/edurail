const supabase = require('../config/supabase');


const getAllSemboyan = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('semboyan')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const getSemboyanById = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from('semboyan')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const createSemboyan = async (req, res) => {

    try {

        const {
            nama,
            arti,
            deskripsi,
            warna
        } = req.body;

        let gambarUrl = null;

        if (req.file) {

            const fileName =
                `${Date.now()}-${req.file.originalname}`;

            const { error: uploadError } =
                await supabase.storage
                .from('edurail')
                .upload(
                    fileName,
                    req.file.buffer,
                    {
                        contentType:
                            req.file.mimetype
                    }
                );

            if (uploadError) throw uploadError;

            const { data: publicUrlData } =
                supabase.storage
                .from('edurail')
                .getPublicUrl(fileName);

            gambarUrl =
                publicUrlData.publicUrl;
        }

        const { data, error } =
            await supabase
            .from('semboyan')
            .insert([
                {
                    nama,
                    arti,
                    gambar: gambarUrl,
                    deskripsi,
                    warna
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            message:
                'Semboyan berhasil ditambahkan',
            data
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const updateSemboyan = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nama,
            arti,
            deskripsi,
            warna
        } = req.body;

        let gambarUrl = undefined;

        if (req.file) {

            const fileName =
                `${Date.now()}-${req.file.originalname}`;

            const { error: uploadError } =
                await supabase.storage
                .from('edurail')
                .upload(
                    fileName,
                    req.file.buffer,
                    {
                        contentType:
                            req.file.mimetype
                    }
                );

            if (uploadError) throw uploadError;

            const { data: publicUrlData } =
                supabase.storage
                .from('edurail')
                .getPublicUrl(fileName);

            gambarUrl =
                publicUrlData.publicUrl;
        }

        const updateData = {
            nama,
            arti,
            deskripsi,
            warna
        };

        if (gambarUrl) {
            updateData.gambar = gambarUrl;
        }

        const { data, error } =
            await supabase
            .from('semboyan')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({
            message:
                'Semboyan berhasil diupdate',
            data
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const deleteSemboyan = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } =
            await supabase
            .from('semboyan')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            message:
                'Semboyan berhasil dihapus'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getAllSemboyan,
    getSemboyanById,
    createSemboyan,
    updateSemboyan,
    deleteSemboyan
};