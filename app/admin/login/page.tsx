import { redirect } from 'next/navigation';
import { ADMIN_LOGIN_PATH } from '@/lib/admin-paths';
export const dynamic='force-dynamic';
export default function LegacyPage(){redirect(ADMIN_LOGIN_PATH);}
