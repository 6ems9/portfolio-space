import SolarSystem from '@/components/SolarSystem';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center text-white overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Latar Belakang Animasi 3D Tata Surya & Bintang */}
      <SolarSystem />

      {/* Konten Utama Portofolio */}
      {/* <div className="z-10 text-center px-6 py-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl max-w-xl mx-4 transition-all hover:border-cyan-500/40">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/50 rounded-full">
          Fullstack Developer Space
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Eksplorasi Dunia Digital
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
          Membangun aplikasi web modern dengan performa tinggi dari kedalaman sistem WSL Ubuntu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
          >
            Jelajahi Proyek
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-medium"
          >
            Hubungi Saya
          </a>
        </div>
      </div> */}
    </main>
  );
}