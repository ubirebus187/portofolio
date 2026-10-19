'use client';
import { useState } from 'react';
import { ArrowLeft,ArrowRight,Eye,EyeOff,LockKeyhole,ShieldCheck } from 'lucide-react';
import { ADMIN_PATH } from '../lib/admin-paths';

type Credentials={username:string;password:string};
type Props={configured:boolean;demoCredentials?:Credentials;onAuthenticate?:(credentials:Credentials)=>Promise<void>};
export function LoginForm({configured,onAuthenticate,demoCredentials}:Props){
  const [username,setUsername]=useState(''),[password,setPassword]=useState('');
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[visible,setVisible]=useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault();if(!configured||busy)return;setError('');setBusy(true);
    try {
      if(onAuthenticate){await onAuthenticate({username,password});return;}
      const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'Login gagal. Silakan coba kembali.');
      window.location.replace(ADMIN_PATH);
    }catch(err){setError((err as Error).message);setBusy(false);}
  }
  return <main className="login-page">
    <section className="login-visual" aria-label="Portfolio Studio">
      <a className="brand" href="/" aria-label="Kembali ke website">ma<span>/</span><small>PORTFOLIO STUDIO</small></a>
      <div className="login-story"><p className="eyebrow">RUANG KERJA PRIBADI</p><h1>Cerita baik.<br/>Karya hebat.<br/><span>Semua di sini.</span></h1><p>Satu ruang untuk mengelola profil,<br/>perjalanan, dan karya terbaikmu.</p><div className="login-art" aria-hidden="true"><span>ma/</span><i/><b>CREATE. REFINE. SHARE.</b></div></div>
      <div className="login-visual-footer"><small>MUHAMAD ALIAMSYAH</small><span>PERSONAL PORTFOLIO © {new Date().getFullYear()}</span></div>
    </section>
    <section className="login-form-wrap"><a className="text-link back-link" href="/"><ArrowLeft size={17}/>Kembali ke website</a>
      <div className="login-form"><div className="login-icon"><LockKeyhole size={23}/></div><p className="eyebrow">AKSES ADMIN</p><h2>Selamat datang<br/>kembali.</h2><p>Masuk untuk memperbarui cerita dan karyamu.</p>
        {demoCredentials&&<div className="demo-credentials"><strong>Coba tampilan admin</strong><p>Username <code>{demoCredentials.username}</code> · Password <code>{demoCredentials.password}</code></p><small>Akun demo untuk file pratinjau ini saja.</small></div>}
        {!configured&&<div className="setup-note" role="status"><strong>Akses admin belum diaktifkan.</strong><p>Lengkapi konfigurasi akun di server sesuai README. Dashboard tetap terkunci sampai login tersedia.</p></div>}
        <form onSubmit={submit} aria-busy={busy}>
          <label className="field" htmlFor="admin-username">Username<input id="admin-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required minLength={3} maxLength={64} placeholder="Masukkan username" disabled={!configured||busy} value={username} onChange={e=>setUsername(e.target.value)} aria-describedby={error?'login-error':undefined}/></label>
          <div className="field"><label htmlFor="admin-password">Password</label><div className="password-input"><input id="admin-password" name="password" type={visible?'text':'password'} autoComplete="current-password" required maxLength={256} placeholder="Masukkan password" disabled={!configured||busy} value={password} onChange={e=>setPassword(e.target.value)} aria-describedby={error?'login-error':undefined}/><button type="button" className="icon-button" onClick={()=>setVisible(!visible)} aria-label={visible?'Sembunyikan password':'Tampilkan password'} aria-pressed={visible} disabled={!configured}>{visible?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></div>
          {error&&<p id="login-error" className="field-error" role="alert">{error}</p>}
          <button className="button primary" type="submit" disabled={busy||!configured}>{busy?'Memeriksa akun…':'Masuk ke dashboard'}<ArrowRight size={18}/></button>
          <p className="login-security"><ShieldCheck size={16}/>{onAuthenticate?'Simulasi lokal · tidak terhubung ke akun asli':'Akses pribadi · hanya untuk administrator'}</p>
        </form>
      </div><p className="login-bottom">Portfolio Studio <span>Ruang untuk tumbuh.</span></p>
    </section>
  </main>;
}
