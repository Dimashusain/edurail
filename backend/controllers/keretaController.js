const supabase = require('../config/supabase');


const getAllKereta = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('kereta')
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


const getKeretaById = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from('kereta')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                message: 'Data kereta tidak ditemukan'
            });
        }

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const createKereta = async (req, res) => {

    try {

        const {
            nama,
            jenis,
            deskripsi
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
            .from('kereta')
            .insert([
                {
                    nama,
                    jenis,
                    gambar: gambarUrl,
                    deskripsi
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            message:
                'Data kereta berhasil ditambahkan',
            data
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const updateKereta = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nama,
            jenis,
            deskripsi
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
            jenis,
            deskripsi
        };

        if (gambarUrl) {
            updateData.gambar = gambarUrl;
        }

        const { data, error } =
            await supabase
            .from('kereta')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({
            message:
                'Data kereta berhasil diupdate',
            data
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const deleteKereta = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } =
            await supabase
            .from('kereta')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            message:
                'Data kereta berhasil dihapus'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getAllKereta,
    getKeretaById,
    createKereta,
    updateKereta,
    deleteKereta
};