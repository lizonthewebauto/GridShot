import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin } from '@/lib/admin';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/auth/callback', '/terms', '/privacy', '/fonts'];
const STRIPE_WEBHOOK_PATH = '/api/stripe/webhook';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Let Stripe webhook through without auth
  if (pathname === STRIPE_WEBHOOK_PATH) {
    return supabaseResponse;
  }

  const { data: { user } } = await supabase.auth.getUser();

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith('/samples/');
  const isOnboarding = pathname.startsWith('/onboarding');

  // Protect dashboard and API routes (allow onboarding + API through for logged-in users)
  if (!user && !isPublic && !isOnboarding) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages → onboarding
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Enforce onboarding completion for dashboard routes, but auto-clear it
  // for admin accounts (lizontheweb.com domain) — admins skip payment and
  // have unlimited access.
  if (user && !isPublic && !isOnboarding && !pathname.startsWith('/api/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, subscription_tier')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      if (isAdmin(user.email)) {
        await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            onboarding_step: 4,
            subscription_tier: 'pro',
            subscription_status: 'admin',
          })
          .eq('id', user.id);
      } else {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    } else if (profile && profile.subscription_tier !== 'pro' && isAdmin(user.email)) {
      // Keep admins permanently on pro tier even if something downgraded them
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'pro', subscription_status: 'admin' })
        .eq('id', user.id);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
