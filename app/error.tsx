'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="setup-page"><h1>Halaman belum dapat dimuat.</h1><p>Coba kembali beberapa saat lagi.</p><button className="button primary" onClick={reset}>Coba lagi</button></main>;}
