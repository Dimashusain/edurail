"use client";

import Card from "@/components/Card";

export default function SafetyPage() {
  const safetyRules = [
    {
      title: "1. Batas Ruang Manfaat Jalan (RUMAJA)",
      emoji: "📐",
      desc: "Ruang Manfaat Jalan (Rumaja) kereta api dibatasi oleh batas tanah tertentu yang harus bebas dari segala rintangan maupun bangunan. Berdasarkan aturan resmi PT KAI, batas jarak aman minimal dari as rel (tengah rel) adalah 6 meter atau sekitar 15-20 kaki di sisi kiri dan kanan rel aktif.",
      points: [
        "Dilarang mendirikan bangunan liar atau menumpuk barang di dekat rel.",
        "Dilarang bercocok tanam atau menggembala ternak di area Rumaja.",
        "Menghindari pembuatan jalan alternatif/ilegal melintasi rel.",
      ],
    },
    {
      title: "2. Protokol Menyeberang Perlintasan Sebidang",
      emoji: "🚶‍♂️",
      desc: "Perlintasan sebidang adalah titik pertemuan sebidang jalan raya dengan jalur kereta api. Selalu ingat prinsip utama keselamatan perlintasan sebidang: BTKD (Berhenti, Tengok Kanan-Kiri, Dengar).",
      points: [
        "Kurangi kecepatan kendaraan dan matikan musik/audio yang mengalihkan perhatian.",
        "Berhenti sejenak sebelum garis perlintasan untuk melihat ke arah kanan dan kiri.",
        "Dengar suara klakson/semboyan 35 dari lokomotif yang akan melintas.",
        "Jangan menerobos palang pintu perlintasan yang mulai ditutup atau sirine yang sudah berbunyi.",
      ],
    },
    {
      title: "3. Larangan Aktivitas Railfans & Fotografi",
      emoji: "📸",
      desc: "Bagi pecinta kereta api (railfans) dan fotografer amatir, mendokumentasikan keindahan kereta harus selalu diimbangi dengan menjaga keselamatan diri sendiri dan kelancaran operasional perjalanan kereta.",
      points: [
        "Selalu berdiri di luar area patok batas tanah kereta api.",
        "Gunakan lensa telephoto agar bisa mengambil gambar jarak jauh tanpa mendekati rel.",
        "Dilarang berjalan di atas rel maupun duduk di dekat lintasan saat memotret.",
        "Jangan mengarahkan lampu flash kamera ke kabin masinis karena dapat mengganggu visibilitas.",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12 px-6 relative">
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto border-b border-white/5 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-semibold uppercase tracking-wider">
            ⚠️ Kampanye Keselamatan Perkeretaapian
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Hub & Panduan Keselamatan</h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Panduan lengkap mengenai hukum, regulasi, dan cara beraktivitas dengan aman di sekitar prasarana jalan rel di seluruh Indonesia.
          </p>
        </div>

        {/* Safety Guidelines Cards */}
        <div className="space-y-6">
          {safetyRules.map((rule, index) => (
            <Card key={index} className="border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{rule.emoji}</span>
                <h3 className="text-xl font-bold text-white">{rule.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aturan Penting:</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  {rule.points.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Emergency Info and Legal Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-red-500/25 bg-red-950/10 space-y-4">
            <h3 className="text-lg font-bold text-red-400">🚨 Sanksi Hukum Pelanggaran</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Berdasarkan **Undang-Undang Nomor 23 Tahun 2007 tentang Perkeretaapian**:
            </p>
            <div className="space-y-2 text-xs text-gray-300">
              <p>
                <strong>Pasal 199:</strong> Setiap orang yang berada di ruang manfaat jalan kereta api, menyeret barang di atas rel, atau beraktivitas lain dapat dikenakan pidana penjara paling lama 3 bulan atau denda maksimal <strong>Rp 15.000.000</strong>.
              </p>
              <p>
                <strong>Pasal 124:</strong> Pada perlintasan sebidang, pemakai jalan wajib mendahulukan perjalanan kereta api.
              </p>
            </div>
          </Card>

          <Card className="border border-blue-500/20 bg-blue-950/10 space-y-4">
            <h3 className="text-lg font-bold text-blue-400">📞 Kontak Darurat PT KAI</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Jika Anda melihat kendala di lintasan rel, palang pintu rusak, atau kecelakaan perlintasan sebidang:
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">Contact Center:</span>
                <span className="text-white font-mono bg-white/5 px-2.5 py-0.5 rounded border border-white/10">121</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">Email KAI:</span>
                <span className="text-white font-mono bg-white/5 px-2.5 py-0.5 rounded border border-white/10">cs@kai.id</span>
              </div>
            </div>
            <p className="text-gray-500 text-[10px] leading-relaxed pt-2">
              * Segera laporkan juga ke pos penjaga perlintasan sebidang (PJL) terdekat apabila terjadi kerusakan atau hambatan di lintasan rel.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}