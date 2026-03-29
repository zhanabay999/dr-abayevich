export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/crm/:path*', '/admin/dashboard/:path*'],
};
