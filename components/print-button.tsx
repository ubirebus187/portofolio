'use client';
export function PrintButton({label='Cetak / Simpan PDF'}:{label?:string}){return <button className="button primary" onClick={()=>window.print()}>{label}</button>;}
