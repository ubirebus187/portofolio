import { isAdminConfigured } from '@/lib/supabase';
import { LoginForm } from '@/components/login-form';
export const dynamic='force-dynamic';
export const metadata={title:'Masuk — Portfolio Studio',robots:{index:false,follow:false}};
export default function LoginPage(){return <LoginForm configured={isAdminConfigured()}/>;}
