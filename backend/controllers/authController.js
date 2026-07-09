const supabase = require("../config/supabase");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cookie disimpan sebagai httpOnly sehingga tidak bisa dibaca JavaScript
// di browser (mencegah pencurian via XSS). `Secure` hanya aktif di produksi
// agar cookie tetap tersimpan saat dev over HTTP (localhost).
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000, // 1 hari, sinkron dgn expiresIn JWT
};

const register = async (req, res) => {
    return res.status(403).json({
        success: false,
        message: 'Registrasi ditutup. Hanya Administrator yang diizinkan untuk login.'
    });
};


const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(404).json({
                message: 'User tidak ditemukan'
            });
        }

        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {
            return res.status(401).json({
                message: 'Password salah'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        // Simpan token di httpOnly cookie — tidak bisa dibaca JavaScript
        // browser, sehingga aman dari pencurian via XSS.
        res.cookie('token', token, COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', { path: '/' });
        res.status(200).json({
            success: true,
            message: 'Logout berhasil'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
};