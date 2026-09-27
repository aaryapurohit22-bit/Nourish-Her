import { type ButtonHTMLAttributes, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity, ArrowRight, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Droplets,
  Dumbbell, HeartPulse, Home as HomeIcon, Leaf, LineChart, Menu, Moon,
  MoreHorizontal, MoveRight, Play, Plus, Settings, ShieldCheck,
  Scale, Sparkles, SunMedium, Target, Utensils, X, Zap
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type IconType = typeof HomeIcon;

const navGroups = [
  { label: 'Overview', items: [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/progress', label: 'Health & Progress', icon: LineChart },
  ]},
  { label: 'Care library', items: [
    { href: '/cycle', label: 'Menstrual Cycle', icon: CalendarDays },
    { href: '/nutrition', label: 'Nutrition', icon: Utensils },
    { href: '/pcos', label: 'PCOS / PCOD', icon: Activity },
    { href: '/menopause', label: 'Menopause', icon: SunMedium },
    { href: '/hygiene', label: 'Menstrual Hygiene', icon: Droplets },
    { href: '/fitness', label: 'Fitness & Self-Care', icon: Dumbbell },
  ]},
];

const pageNames: Record<string, string> = {
  '/progress': 'Health & progress',
  '/cycle': 'Menstrual cycle',
  '/nutrition': 'Nutrition planner',
  '/pcos': 'PCOS / PCOD support',
  '/menopause': 'Menopause support',
  '/hygiene': 'Menstrual hygiene',
  '/fitness': 'Fitness & self-care',
};

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function getLocalDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" data-testid="link-logo" className="flex items-center gap-3 group">
      <span className={`relative grid h-9 w-9 place-items-center rounded-[11px] ${dark ? 'bg-[#9bd6c2] text-[#173b3d]' : 'bg-[#1e6364] text-[#f7f2e8]'}`}>
        <span className="absolute h-4 w-4 rounded-full border-[1.5px] border-current" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className={`font-display text-[22px] tracking-[-.03em] ${dark ? 'text-[#f7f2e8]' : 'text-[#173b3d]'}`}>nourish her</span>
    </Link>
  );
}

function Button({ children, className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'quiet' | 'outline' | 'dark' }) {
  const styles = {
    primary: 'bg-[#1e6364] text-[#fbf8f0] hover:bg-[#174e50] shadow-sm',
    quiet: 'bg-[#e8f0ea] text-[#174e50] hover:bg-[#dbe8df]',
    outline: 'border border-[#d7dfd7] bg-[#fbf8f0] text-[#275b5a] hover:border-[#1e6364] hover:bg-[#f2f6ef]',
    dark: 'bg-[#173b3d] text-[#fbf8f0] hover:bg-[#102f31] shadow-sm',
  };
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${styles[variant]} ${className}`}>{children}</button>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentTime = new Date();
  const currentTitle = location === '/dashboard' ? getGreeting(currentTime) : pageNames[location] || 'Nourish Her';
  const currentDate = getLocalDateLabel(currentTime);
  return (
    <div className="grain min-h-[100dvh] bg-[#f6f3ea] text-[#173b3d]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#173b3d] px-5 py-6 text-[#f7f2e8] transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Logo dark />
          <button className="rounded-md p-2 text-[#b5cbc2] hover:bg-[#244d4d] lg:hidden" aria-label="Close navigation" data-testid="button-close-navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
          <div className="mt-10 flex items-center gap-3 rounded-xl border border-[#315858] bg-[#204748] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e6bc83] text-xs font-bold text-[#173b3d]">NH</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Your health space</p>
            <p className="text-xs text-[#a8c0b7]">Personal space</p>
          </div>
          <ChevronDown size={15} className="ml-auto text-[#9bb9ae]" />
        </div>
        <nav className="mt-8 flex-1 space-y-7" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#82a39a]">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location === item.href;
                  return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? 'bg-[#9bd6c2] font-semibold text-[#173b3d]' : 'text-[#c1d3cb] hover:bg-[#234e4e] hover:text-[#f7f2e8]'}`}><Icon size={17} strokeWidth={active ? 2.3 : 1.8} /><span>{item.label}</span>{active && <ChevronRight size={14} className="ml-auto" />}</Link>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-[#315858] pt-4">
          <Link href="/auth" data-testid="link-settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#c1d3cb] hover:bg-[#234e4e]"><Settings size={17} /> Account settings</Link>
          <div className="mt-4 rounded-xl bg-[#285354] p-3.5">
            <div className="mb-2 flex items-center gap-2 text-[#a9ddc8]"><ShieldCheck size={15} /><span className="text-xs font-semibold">Your space is private</span></div>
            <p className="text-[11px] leading-relaxed text-[#a8c0b7]">A calm place for your health notes, patterns and progress.</p>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-[#173b3d]/35 lg:hidden" aria-label="Close navigation overlay" data-testid="button-navigation-overlay" onClick={() => setMobileOpen(false)} />}
      <main className="lg:pl-[258px]">
        <header className="sticky top-0 z-20 border-b border-[#e0e3d9]/80 bg-[#f6f3ea]/90 px-5 py-4 backdrop-blur-lg md:px-8">
          <div className="mx-auto flex max-w-[1420px] items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] p-2 lg:hidden" aria-label="Open navigation" data-testid="button-open-navigation" onClick={() => setMobileOpen(true)}><Menu size={19} /></button>
              <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">{currentDate}</p><h1 className="mt-0.5 text-lg font-semibold tracking-[-.02em]">{currentTitle}</h1></div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="relative rounded-lg p-2 text-[#557674] hover:bg-[#e8eee8]" aria-label="View notifications" data-testid="button-notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d18b62]" /></button>
              <div className="hidden h-7 w-px bg-[#dfe3d9] md:block" />
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e7bf86] text-xs font-bold text-[#173b3d]">NH</div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1420px] px-5 pb-14 pt-7 md:px-8">{children}</div>
      </main>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#71908b]">{eyebrow}</p>}<h2 className="font-display text-[30px] leading-tight tracking-[-.035em] text-[#173b3d] md:text-[37px]">{title}</h2>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-[#66807c]">{description}</p>}</div>{action}</div>;
}

function Home() {
  return <div className="grain min-h-[100dvh] bg-[#f6f3ea] text-[#173b3d]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
      <Logo />
      <nav className="hidden items-center gap-7 text-sm font-medium text-[#52736f] md:flex"><a href="#approach" data-testid="link-home-approach">Our approach</a><a href="#care" data-testid="link-home-care">Care library</a><a href="#privacy" data-testid="link-home-privacy">Privacy</a></nav>
      <div className="flex items-center gap-2"><Link href="/auth" data-testid="link-home-sign-in" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#356562] hover:bg-[#e8eee8] sm:block">Sign in</Link><Link href="/onboarding" data-testid="link-home-start" className="rounded-lg bg-[#1e6364] px-4 py-2.5 text-sm font-semibold text-[#fbf8f0] shadow-sm hover:bg-[#174e50]">Start your space <ArrowRight size={15} className="ml-1 inline" /></Link></div>
    </header>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 md:grid-cols-[1.03fr_.97fr] md:items-center md:px-10 md:pb-28 md:pt-20">
      <div className="max-w-xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cfe0d5] bg-[#edf5ee] px-3 py-1.5 text-xs font-semibold text-[#38706a]"><span className="h-1.5 w-1.5 rounded-full bg-[#6da98e]" /> A better relationship with your health</div>
        <h1 className="font-display text-[54px] leading-[.98] tracking-[-.055em] text-[#173b3d] md:text-[78px]">Care that makes <em className="text-[#b86f4e]">room</em> for you.</h1>
        <p className="mt-7 max-w-md text-[17px] leading-8 text-[#66807c]">Nourish Her brings your cycle, nutrition, movement and wellbeing into one thoughtful space — with guidance that respects your whole life.</p>
        <div className="mt-9 flex flex-wrap items-center gap-3"><Link href="/onboarding" data-testid="link-hero-create" className="inline-flex items-center gap-2 rounded-lg bg-[#1e6364] px-5 py-3.5 text-sm font-semibold text-[#fbf8f0] shadow-soft hover:-translate-y-0.5 hover:bg-[#174e50]">Create your health space <ArrowRight size={16} /></Link><Link href="/dashboard" data-testid="link-hero-preview" className="inline-flex items-center gap-2 rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-5 py-3.5 text-sm font-semibold text-[#356562] hover:border-[#9fbdb0]">See a preview <MoveRight size={16} /></Link></div>
        <div className="mt-12 flex items-center gap-4 border-t border-[#dfe3d9] pt-5 text-xs text-[#71908b]"><ShieldCheck size={17} className="text-[#4b8c7c]" /><span>Thoughtful by design. Private by default.</span></div>
      </div>
      <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-[#dceae1] p-5 shadow-soft md:min-h-[555px] md:p-7">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[1px] border-[#a9cbb8] opacity-70" /><div className="absolute -bottom-24 -left-14 h-72 w-72 rounded-full border-[1px] border-[#abcdbd] opacity-60" />
        <div className="relative h-full rounded-[21px] border border-[#f7fbf4]/80 bg-[#eff5ec]/85 p-5 backdrop-blur-sm md:p-7">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#71908b]">Your week at a glance</p><p className="mt-2 font-display text-2xl text-[#173b3d]">Feeling more in tune</p></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1e6364] text-[#a9ddc8]"><HeartPulse size={20} /></div></div>
          <div className="mt-8 rounded-2xl bg-[#fbf8f0] p-5 shadow-card"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[#71908b]">Cycle day</p><p className="mt-1 font-display text-5xl text-[#173b3d]">14</p></div><div className="relative grid h-28 w-28 place-items-center rounded-full" style={{ background: 'conic-gradient(#1e6364 0 46%, #cfe3d8 46% 72%, #e7eee6 72% 100%)' }}><div className="grid h-20 w-20 place-items-center rounded-full bg-[#fbf8f0]"><span className="text-center text-[10px] font-semibold leading-4 text-[#66807c]">of 30<br />days</span></div></div></div><div className="mt-5 border-t border-[#e7ebe2] pt-4 text-xs text-[#66807c]"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#c98764]" />Energy may rise this week. A good time for strength and new ideas.</div></div>
          <div className="mt-4 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-[#285b5a] p-4 text-[#edf5ec]"><p className="text-[10px] uppercase tracking-wider text-[#abd2c1]">Today</p><p className="mt-2 text-sm font-semibold">Hydration check-in</p><div className="mt-3 h-1.5 rounded-full bg-[#4d8078]"><div className="h-1.5 w-[72%] rounded-full bg-[#acd8c1]" /></div></div><div className="rounded-2xl border border-[#dbe7dc] bg-[#f8f4e9] p-4"><p className="text-[10px] uppercase tracking-wider text-[#71908b]">Next up</p><p className="mt-2 text-sm font-semibold text-[#275b5a]">Rest & reset</p><p className="mt-2 text-xs text-[#78908a]">Tomorrow · 8 min</p></div></div>
        </div>
      </div>
    </section>
    <section id="approach" className="border-y border-[#e1e3d9] bg-[#fbf8f0] px-5 py-16 md:px-10 md:py-24"><div className="mx-auto max-w-7xl"><div className="grid gap-10 md:grid-cols-[.75fr_1.25fr]"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#71908b]">A calmer way in</p><h2 className="mt-3 max-w-sm font-display text-4xl leading-tight tracking-[-.04em]">Health is not a checklist.</h2></div><div className="grid gap-8 sm:grid-cols-3"><Feature icon={Target} number="01" title="Notice patterns" text="Simple check-ins help you see what your body has been saying." /><Feature icon={BookOpen} number="02" title="Understand more" text="Clear, considered guidance without the noise or alarm." /><Feature icon={Leaf} number="03" title="Choose gently" text="Small next steps that fit the person you are today." /></div></div></div></section>
    <section id="care" className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24"><div className="max-w-xl"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#71908b]">One space, many seasons</p><h2 className="mt-3 font-display text-4xl leading-tight tracking-[-.04em] md:text-5xl">Support for the parts of you that connect.</h2></div><div className="mt-10 grid gap-3 md:grid-cols-12"><CareTile href="/cycle" title="Cycle" kicker="Track with context" span="md:col-span-7" color="bg-[#dceae1]" icon={CalendarDays} /><CareTile href="/nutrition" title="Nutrition" kicker="Eat for your energy" span="md:col-span-5" color="bg-[#f1e5d2]" icon={Utensils} /><CareTile href="/fitness" title="Movement" kicker="Feel good in your body" span="md:col-span-5" color="bg-[#e4e1eb]" icon={Dumbbell} /><CareTile href="/progress" title="Your progress" kicker="See the bigger picture" span="md:col-span-7" color="bg-[#d5e7e5]" icon={LineChart} /></div></section>
    <section id="privacy" className="bg-[#173b3d] px-5 py-16 text-[#f7f2e8] md:px-10 md:py-24"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9bd6c2]">Begin where you are</p><h2 className="mt-3 max-w-lg font-display text-4xl leading-tight tracking-[-.04em] md:text-5xl">A little more clarity can change a lot.</h2></div><Link href="/onboarding" data-testid="link-footer-start" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#9bd6c2] px-5 py-3.5 text-sm font-bold text-[#173b3d] hover:bg-[#b5e2d0]">Make space for your health <ArrowRight size={16} /></Link></div><div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#315858] pt-5 text-xs text-[#a8c0b7]"><span>Educational, not diagnostic</span><span>Built for real life</span><span>Private by default</span></div></section>
  </div>;
}

function Feature({ icon: Icon, number, title, text }: { icon: IconType; number: string; title: string; text: string }) {
  return <div><div className="mb-5 flex items-center justify-between border-b border-[#e1e3d9] pb-3 text-xs font-bold text-[#b47758]"><span>{number}</span><Icon size={18} className="text-[#4b8c7c]" /></div><h3 className="font-semibold text-[#275b5a]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#71908b]">{text}</p></div>;
}

function CareTile({ href, title, kicker, span, color, icon: Icon }: { href: string; title: string; kicker: string; span: string; color: string; icon: IconType }) {
  return <Link href={href} data-testid={`link-care-${title.toLowerCase().replaceAll(' ', '-')}`} className={`group ${span} ${color} flex min-h-[178px] flex-col justify-between rounded-2xl p-6 hover:-translate-y-1 md:p-8`}><div className="flex items-start justify-between"><span className="text-[11px] font-bold uppercase tracking-[.16em] text-[#52736f]">{kicker}</span><Icon size={21} className="text-[#38706a] transition-transform group-hover:translate-x-1" /></div><div><h3 className="font-display text-3xl tracking-[-.03em] text-[#173b3d]">{title}</h3><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#356562]">Explore <ArrowRight size={13} /></span></div></Link>;
}

function Auth() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [submitted, setSubmitted] = useState(false);
  return <div className="grain flex min-h-[100dvh] bg-[#f6f3ea] text-[#173b3d]"><div className="hidden w-[42%] flex-col justify-between bg-[#173b3d] p-8 text-[#f7f2e8] lg:flex"><Logo dark /><div className="max-w-md pb-10"><p className="mb-5 text-[11px] font-bold uppercase tracking-[.18em] text-[#9bd6c2]">Your health, held with care</p><h1 className="font-display text-6xl leading-[1.02] tracking-[-.05em]">A trusted place to listen in.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#b7cbc1]">Build a more useful picture of your health, one gentle check-in at a time.</p><div className="mt-12 flex gap-2"><span className="h-1.5 w-12 rounded-full bg-[#9bd6c2]" /><span className="h-1.5 w-5 rounded-full bg-[#416c68]" /><span className="h-1.5 w-5 rounded-full bg-[#416c68]" /></div></div><p className="text-xs text-[#82a39a]">Nourish Her · Personal health companion</p></div><div className="flex flex-1 flex-col px-5 py-6 md:px-12"><div className="flex items-center justify-between lg:justify-end"><div className="lg:hidden"><Logo /></div><Link href="/" data-testid="link-auth-home" className="text-sm font-semibold text-[#52736f] hover:text-[#1e6364]">Back to home</Link></div><div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-12"><p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-[#71908b]">{mode === 'signin' ? 'Welcome back' : 'Start your space'}</p><h2 className="font-display text-4xl tracking-[-.04em]">{mode === 'signin' ? 'Good to see you.' : 'Make room for yourself.'}</h2><p className="mt-3 text-sm leading-6 text-[#71908b]">{mode === 'signin' ? 'Sign in to pick up where you left off.' : 'A few details help us make your space more relevant.'}</p><div className="mt-8 flex rounded-lg bg-[#e8eee8] p-1"><button onClick={() => { setMode('signin'); setSubmitted(false); }} data-testid="button-auth-sign-in-toggle" className={`flex-1 rounded-md py-2 text-sm font-semibold ${mode === 'signin' ? 'bg-[#fbf8f0] text-[#1e6364] shadow-sm' : 'text-[#71908b]'}`}>Sign in</button><button onClick={() => { setMode('signup'); setSubmitted(false); }} data-testid="button-auth-sign-up-toggle" className={`flex-1 rounded-md py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-[#fbf8f0] text-[#1e6364] shadow-sm' : 'text-[#71908b]'}`}>Create account</button></div>{submitted ? <div className="mt-7 rounded-xl border border-[#c8dfd2] bg-[#edf6ef] p-5"><div className="flex items-center gap-2 font-semibold text-[#2c6b5f]"><Check size={18} /> You are all set for this demo.</div><p className="mt-2 text-sm leading-6 text-[#5f7b76]">Your personal health space is ready to explore.</p><Button className="mt-4 w-full" onClick={() => navigate('/dashboard')} data-testid="button-auth-continue">Continue to dashboard <ArrowRight size={15} /></Button></div> : <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Email address<input required type="email" data-testid="input-auth-email" placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" /></label><label className="block text-sm font-semibold">Password<input required minLength={6} type="password" data-testid="input-auth-password" placeholder="At least 6 characters" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" /></label>{mode === 'signup' && <label className="block text-sm font-semibold">Your first name<input required data-testid="input-auth-name" placeholder="What should we call you?" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" /></label>}<Button type="submit" className="mt-3 w-full" data-testid="button-auth-submit">{mode === 'signin' ? 'Sign in to Nourish Her' : 'Create my space'} <ArrowRight size={15} /></Button><p className="pt-3 text-center text-xs leading-5 text-[#8aa09a]">By continuing, you agree to our terms and understand this is educational support, not medical diagnosis.</p></form>}</div></div></div>;
}

function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const options = step === 1 ? ['Understand my cycle', 'Support my energy', 'Prepare for menopause', 'Manage PCOS / PCOD'] : ['My periods are regular', 'My periods are changing', 'I am not sure yet', 'I do not have periods'];
  const toggle = (value: string) => setSelected((current) => current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);
  return <div className="grain min-h-[100dvh] bg-[#f6f3ea] px-5 py-6 text-[#173b3d] md:px-10"><div className="mx-auto flex max-w-6xl items-center justify-between"><Logo /><Link href="/" data-testid="link-onboarding-exit" className="text-sm font-semibold text-[#71908b] hover:text-[#1e6364]">Save and exit</Link></div><div className="mx-auto grid max-w-5xl gap-12 py-14 md:grid-cols-[.72fr_1.28fr] md:items-center md:py-24"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#71908b]">A few thoughtful questions</p><h1 className="mt-3 font-display text-5xl leading-[1.03] tracking-[-.05em] md:text-6xl">{step === 1 ? 'What would feel most useful right now?' : 'How would you describe your cycle?'}</h1><p className="mt-5 max-w-sm text-sm leading-7 text-[#71908b]">There is no right answer. Your choices shape what we place in your space.</p><div className="mt-10 flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-[#1e6364]" /><div className={`h-1.5 w-20 rounded-full ${step > 1 ? 'bg-[#1e6364]' : 'bg-[#dbe4dc]'}`} /><div className="h-1.5 w-20 rounded-full bg-[#dbe4dc]" /><span className="ml-2 text-xs font-semibold text-[#71908b]">0{step} / 03</span></div></div><div className="rounded-3xl border border-[#dce4da] bg-[#fbf8f0] p-6 shadow-soft md:p-9"><div className="mb-7 flex items-center justify-between"><span className="text-sm font-semibold text-[#52736f]">Tell us a little about you</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8f0ea] text-[#397269]">{step === 1 ? <Target size={18} /> : <CalendarDays size={18} />}</span></div><div className="space-y-2.5">{options.map((option) => <button key={option} onClick={() => toggle(option)} data-testid={`button-onboarding-${option.toLowerCase().replaceAll(' ', '-')}`} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-sm font-semibold ${selected.includes(option) ? 'border-[#4a9a83] bg-[#e9f3eb] text-[#1e6364]' : 'border-[#e0e5dc] bg-[#fbf8f0] text-[#52736f] hover:border-[#9fbdb0]'}`}><span>{option}</span>{selected.includes(option) ? <span className="grid h-5 w-5 place-items-center rounded-full bg-[#4a9a83] text-white"><Check size={13} /></span> : <span className="h-5 w-5 rounded-full border border-[#cad8cd]" />}</button>)}</div><div className="mt-8 flex items-center justify-between"><button onClick={() => step > 1 && setStep(step - 1)} data-testid="button-onboarding-back" className={`text-sm font-semibold ${step > 1 ? 'text-[#52736f] hover:text-[#1e6364]' : 'invisible'}`}>Back</button><Button onClick={() => step < 2 ? setStep(2) : navigate('/dashboard')} data-testid="button-onboarding-next">{step < 2 ? 'Continue' : 'Build my space'} <ArrowRight size={15} /></Button></div></div></div></div>;
}

function StatCard({ label, value, detail, accent = 'teal', icon: Icon }: { label: string; value: string; detail: string; accent?: string; icon: IconType }) {
  const colors: Record<string, string> = { teal: 'bg-[#e1efea] text-[#1e6364]', ochre: 'bg-[#f4e8d4] text-[#9b633f]', lilac: 'bg-[#e8e6ef] text-[#615d7c]', blue: 'bg-[#deebec] text-[#3f7776]' };
  return <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card"><div className="flex items-start justify-between"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#71908b]">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-lg ${colors[accent]}`}><Icon size={17} /></span></div><p className="mt-5 font-display text-4xl tracking-[-.04em] text-[#173b3d]">{value}</p><p className="mt-1 text-xs text-[#78908a]">{detail}</p></div>;
}

function Dashboard() {
  const [logged, setLogged] = useState(false);
  return (
    <div className="page-enter">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-[#71908b]">Here’s a gentle place to start your day.</p>
          <h2 className="mt-1 font-display text-4xl tracking-[-.04em]">Your health overview</h2>
        </div>
        <Button variant="outline" onClick={() => setLogged((v) => !v)} data-testid="button-log-check-in">
          <Plus size={16} /> {logged ? 'Check-in added' : 'Add a check-in'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cycle information" value="Not set" detail="Add details when you’re ready" icon={CalendarDays} />
        <StatCard label="Mood" value="Not logged" detail="Your check-ins will appear here" accent="ochre" icon={SunMedium} />
        <StatCard label="Movement" value="Not logged" detail="Your activity will appear here" accent="lilac" icon={Dumbbell} />
        <StatCard label="Hydration" value="Not logged" detail="Your hydration will appear here" accent="blue" icon={Droplets} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Cycle information</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">Your cycle details</h3>
            </div>
            <Link href="/cycle" data-testid="link-dashboard-cycle" className="text-xs font-bold text-[#397269] hover:underline">
              Open cycle page <ArrowRight size={13} className="ml-1 inline" />
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative mx-auto grid h-52 w-52 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#d9e7dc 0 100%)' }}>
              <div className="grid h-40 w-40 place-items-center rounded-full bg-[#fbf8f0] text-center">
                <span className="font-display text-5xl text-[#173b3d]">—</span>
                <span className="text-xs text-[#71908b]">No cycle data yet</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <Phase label="Menstruation" dates="Not set" color="bg-[#d18b62]" />
                <Phase label="Follicular" dates="Not set" color="bg-[#1e6364]" />
                <Phase label="Ovulation" dates="Not set" color="bg-[#d7ae72]" />
                <Phase label="Luteal" dates="Not set" color="bg-[#9ca7bb]" />
              </div>
              <p className="mt-6 rounded-xl bg-[#edf5ee] px-4 py-3 text-xs leading-5 text-[#52736f]">
                Your cycle information will appear here when you add it.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#dceae1] p-6 md:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#52736f]">Today’s care note</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em] text-[#173b3d]">Start with one small step.</h3>
            </div>
            <BookOpen size={20} className="text-[#397269]" />
          </div>
          <p className="mt-5 text-sm leading-6 text-[#52736f]">Explore the care library whenever you’re ready. You can choose what feels useful today.</p>
          <div className="mt-7 rounded-xl bg-[#f7f2e8]/75 p-4">
            <p className="text-xs font-bold text-[#275b5a]">Explore a topic</p>
            <p className="mt-1 text-xs leading-5 text-[#66807c]">Nutrition, movement, cycle care and more</p>
          </div>
          <Link href="/nutrition" data-testid="link-dashboard-nutrition" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#275b5a]">
            Open care library <ArrowRight size={13} />
          </Link>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl tracking-[-.03em]">Your check-ins</h3>
            <button aria-label="More check-in options" data-testid="button-rhythm-options" className="rounded-md p-1 text-[#71908b] hover:bg-[#edf0e8]">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="mt-7 flex min-h-[126px] items-center justify-center rounded-xl bg-[#f0f3ec] px-6 text-center text-sm text-[#78908a]">
            No check-ins yet. Add one whenever you’re ready.
          </div>
          <p className="mt-5 text-xs text-[#78908a]">Your check-in history will appear here.</p>
        </section>

        <section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Your care plan</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">Small steps, at your pace.</h3>
            </div>
            <Link href="/fitness" data-testid="link-dashboard-care-plan" className="text-xs font-bold text-[#397269]">
              Explore plan <ArrowRight size={13} className="ml-1 inline" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <PlanItem icon={Dumbbell} time="Suggested" title="Stretch & reset" />
            <PlanItem icon={Utensils} time="Suggested" title="Nutrition ideas" />
            <PlanItem icon={Moon} time="When ready" title="Wind-down ritual" />
          </div>
        </section>
      </div>
    </div>
  );
}

function Phase({ label, dates, color, active = false }: { label: string; dates: string; color: string; active?: boolean }) {
  return <div className={`flex items-center gap-3 ${active ? 'text-[#275b5a]' : 'text-[#78908a]'}`}><span className={`h-2.5 w-2.5 rounded-full ${color}`} /><span className={`w-24 text-xs ${active ? 'font-bold' : ''}`}>{label}</span><span className="text-xs">{dates}</span>{active && <span className="ml-auto rounded-full bg-[#e1efea] px-2 py-1 text-[10px] font-bold text-[#397269]">Today</span>}</div>;
}
function PlanItem({ icon: Icon, time, title, done = false }: { icon: IconType; time: string; title: string; done?: boolean }) {
  return <div className="flex items-center gap-3 rounded-xl border border-[#e4e8df] p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf5ee] text-[#397269]">{done ? <Check size={16} /> : <Icon size={16} />}</span><div><p className="text-xs font-bold text-[#52736f]">{title}</p><p className="mt-0.5 text-[10px] text-[#8aa09a]">{time}</p></div></div>;
}

type CyclePhaseKey = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

const cyclePhaseKeys: CyclePhaseKey[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

const cyclePhaseData: Record<CyclePhaseKey, {
  label: string;
  range: string;
  color: string;
  soft: string;
  text: string;
  guidance: {
    nutrition: string;
    hydration: string;
    exercise: string;
    selfCare: string;
  };
}> = {
  menstrual: {
    label: 'Menstrual',
    range: 'General guidance',
    color: 'bg-[#d18b62]',
    soft: 'bg-[#f4e2d7]',
    text: 'text-[#9d6042]',
    guidance: {
      nutrition: 'Iron-rich, warming meals',
      hydration: 'Water and mineral-rich fluids',
      exercise: 'Gentle walking or mobility',
      selfCare: 'Heat, rest and quiet',
    },
  },
  follicular: {
    label: 'Follicular',
    range: 'General guidance',
    color: 'bg-[#1e6364]',
    soft: 'bg-[#e1efea]',
    text: 'text-[#1e6364]',
    guidance: {
      nutrition: 'Fresh, colourful meals',
      hydration: 'Steady water through the day',
      exercise: 'Strength and playful movement',
      selfCare: 'Try something that feels new',
    },
  },
  ovulation: {
    label: 'Ovulation',
    range: 'General guidance',
    color: 'bg-[#d7ae72]',
    soft: 'bg-[#f4e8d4]',
    text: 'text-[#9b633f]',
    guidance: {
      nutrition: 'Fibre, protein and healthy fats',
      hydration: 'Water before and after movement',
      exercise: 'Power, intervals or group activity',
      selfCare: 'Connection and clear boundaries',
    },
  },
  luteal: {
    label: 'Luteal',
    range: 'General guidance',
    color: 'bg-[#9ca7bb]',
    soft: 'bg-[#e8e6ef]',
    text: 'text-[#615d7c]',
    guidance: {
      nutrition: 'Slow-release carbohydrates',
      hydration: 'Keep water easy to reach',
      exercise: 'Moderate strength or restorative flow',
      selfCare: 'Earlier nights and fewer demands',
    },
  },
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCycleDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function formatCalendarMonth(date: Date) {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date);
}

function isSameDate(first: Date | null, second: Date | null) {
  return Boolean(first && second && dateKey(first) === dateKey(second));
}

function daysInclusive(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const leadingDays = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return Array.from({ length: leadingDays + daysInMonth }, (_, index) => (
    index < leadingDays
      ? null
      : new Date(month.getFullYear(), month.getMonth(), index - leadingDays + 1)
  ));
}

function Cycle() {
  const today = new Date();
  const [activePhase, setActivePhase] = useState<CyclePhaseKey>('menstrual');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(null);
  const [savedStart, setSavedStart] = useState<Date | null>(null);
  const [savedEnd, setSavedEnd] = useState<Date | null>(null);
  const [symptom, setSymptom] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const phase = cyclePhaseData[activePhase];
  const hasSavedDates = Boolean(savedStart && savedEnd);
  const savedPeriodLength = savedStart && savedEnd ? daysInclusive(savedStart, savedEnd) : null;
  const calendarDays = getCalendarDays(calendarMonth);
  const highlightedStart = calendarOpen ? draftStart : savedStart;
  const highlightedEnd = calendarOpen ? draftEnd : savedEnd;

  const openCalendar = () => {
    const nextStart = savedStart;
    setDraftStart(nextStart);
    setDraftEnd(savedEnd);
    setCalendarMonth(nextStart ? new Date(nextStart.getFullYear(), nextStart.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1));
    setCalendarOpen(true);
  };

  const selectCalendarDate = (date: Date) => {
    if (!draftStart || draftEnd || date.getTime() < draftStart.getTime()) {
      setDraftStart(date);
      setDraftEnd(null);
      return;
    }
    setDraftEnd(date);
  };

  const saveDates = () => {
    if (!draftStart || !draftEnd) return;
    setSavedStart(draftStart);
    setSavedEnd(draftEnd);
    setCalendarOpen(false);
  };

  const scrollToLog = () => {
    document.getElementById('symptom-log')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const saveSymptom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!symptom) return;
    setSaved(true);
    setSymptom('');
    setNote('');
  };

  return (
    <div className="page-enter">
      <SectionTitle
        eyebrow="Know your rhythm"
        title="Your cycle, with context."
        description="Set your period dates to create a simple cycle overview, then explore practical support for each phase."
        action={
          <Button variant="outline" onClick={scrollToLog} data-testid="button-cycle-log">
            <Plus size={16} /> Log symptoms
          </Button>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#cfe0d5] bg-[#edf5ee] px-4 py-3 text-xs leading-5 text-[#52736f]">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#397269]" />
        <p><span className="font-bold text-[#275b5a]">Cycle dates stay on this page.</span> Nothing is saved until you choose both dates and select save.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Current cycle</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">{hasSavedDates ? 'Period dates saved' : 'Cycle not set'}</h3>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${hasSavedDates ? 'bg-[#e1efea] text-[#397269]' : 'bg-[#f0f3ec] text-[#78908a]'}`}>
              {hasSavedDates ? 'Ready to track' : 'Set your dates'}
            </span>
          </div>

          <div className="my-9 grid place-items-center">
            <div
              className="relative grid h-56 w-56 place-items-center rounded-full"
              role="img"
              aria-label={hasSavedDates ? 'Period dates saved' : 'Cycle not set'}
              style={{ background: hasSavedDates ? 'conic-gradient(#d18b62 0 100%)' : 'conic-gradient(#d9e7dc 0 100%)' }}
            >
              <div className="grid h-40 w-40 place-items-center rounded-full bg-[#fbf8f0] text-center">
                <span className="font-display text-5xl">{hasSavedDates ? 'Set' : '—'}</span>
                <span className="text-xs text-[#71908b]">{hasSavedDates ? 'period recorded' : 'set dates to begin'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Period start', savedStart ? formatCycleDate(savedStart) : 'Not set'],
              ['Period end', savedEnd ? formatCycleDate(savedEnd) : 'Not set'],
              ['Period length', savedPeriodLength ? `${savedPeriodLength} days` : 'Not set'],
              ['Cycle status', hasSavedDates ? 'Dates saved' : 'Not set'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#f0f3ec] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[#8aa09a]">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#52736f]">{value}</p>
              </div>
            ))}
          </div>

          <Button className="mt-5 w-full" onClick={openCalendar} data-testid="button-cycle-open-calendar">
            <CalendarDays size={16} /> {hasSavedDates ? 'Edit period dates' : 'Open calendar'}
          </Button>
        </section>

        <section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Four phases</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">Choose a phase to explore.</h3>
            </div>
            <CalendarDays size={20} className="text-[#397269]" />
          </div>
          <div className="mt-6 grid gap-2.5">
            {cyclePhaseKeys.map((key) => {
              const item = cyclePhaseData[key];
              const isActive = activePhase === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePhase(key)}
                  data-testid={`button-cycle-phase-${key}`}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${isActive ? 'border-[#9fcdbb] bg-[#edf5ee]' : 'border-[#e4e8df] bg-[#fbf8f0] hover:border-[#b7cfc1]'}`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${item.soft}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-bold ${isActive ? 'text-[#275b5a]' : 'text-[#52736f]'}`}>{item.label}</span>
                    <span className="mt-0.5 block text-[11px] text-[#8aa09a]">{item.range}</span>
                  </span>
                  {isActive && <Check size={16} className="shrink-0 text-[#397269]" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {calendarOpen && (
        <section className="mt-5 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Period dates</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">Choose your period window.</h3>
              <p className="mt-2 text-sm leading-6 text-[#71908b]">{!draftStart ? 'Select the first day of your period.' : !draftEnd ? 'Now select the last day of your period.' : 'Your dates are ready to save.'}</p>
            </div>
            <button type="button" onClick={() => setCalendarOpen(false)} className="w-fit rounded-lg px-3 py-2 text-sm font-semibold text-[#71908b] hover:bg-[#edf0e8]" data-testid="button-cycle-close-calendar">
              Close
            </button>
          </div>

          <div className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                  aria-label="Previous month"
                  className="rounded-lg p-2 text-[#52736f] hover:bg-[#edf0e8]"
                  data-testid="button-cycle-previous-month"
                >
                  <ChevronLeft size={18} />
                </button>
                <h4 className="font-display text-xl">{formatCalendarMonth(calendarMonth)}</h4>
                <button
                  type="button"
                  onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                  aria-label="Next month"
                  className="rounded-lg p-2 text-[#52736f] hover:bg-[#edf0e8]"
                  data-testid="button-cycle-next-month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-[#8aa09a]">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day} className="py-2">{day}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) return <span key={`empty-${index}`} className="aspect-square" />;
                  const isStart = isSameDate(day, highlightedStart);
                  const isEnd = isSameDate(day, highlightedEnd);
                  const isInRange = Boolean(highlightedStart && highlightedEnd && day >= highlightedStart && day <= highlightedEnd);
                  return (
                    <button
                      key={dateKey(day)}
                      type="button"
                      onClick={() => selectCalendarDate(day)}
                      aria-label={`Select ${formatCycleDate(day)}`}
                      aria-pressed={isStart || isEnd}
                      data-testid={`button-cycle-date-${dateKey(day)}`}
                      className={`relative aspect-square rounded-lg text-sm font-semibold transition-colors ${isStart || isEnd ? 'bg-[#1e6364] text-[#fbf8f0]' : isInRange ? 'bg-[#e1efea] text-[#275b5a]' : 'text-[#52736f] hover:bg-[#edf5ee]'}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-[#edf5ee] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Your selection</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#d7e5d9] pb-3 text-sm">
                  <span className="text-[#71908b]">First day</span>
                  <span className="font-semibold text-[#275b5a]">{draftStart ? formatCycleDate(draftStart) : 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#d7e5d9] pb-3 text-sm">
                  <span className="text-[#71908b]">Last day</span>
                  <span className="font-semibold text-[#275b5a]">{draftEnd ? formatCycleDate(draftEnd) : 'Not selected'}</span>
                </div>
              </div>
              <p className="mt-5 text-xs leading-5 text-[#66807c]">Select the first day, then the last day. You can edit the range anytime.</p>
              <Button className="mt-6 w-full" onClick={saveDates} disabled={!draftStart || !draftEnd} data-testid="button-cycle-save-dates">
                <Check size={15} /> Save selected dates
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="mt-5 rounded-2xl bg-[#e4e1eb] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#686381]">Phase-wise guidance</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em] text-[#34354e]">{phase.label} phase support</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5c6077]">General education, not a prescription. Your energy and needs can vary from cycle to cycle.</p>
          </div>
          <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${phase.soft} ${phase.text}`}>{phase.range}</span>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <GuidanceCard icon={Utensils} label="Nutrition" text={phase.guidance.nutrition} />
          <GuidanceCard icon={Droplets} label="Hydration" text={phase.guidance.hydration} />
          <GuidanceCard icon={Dumbbell} label="Exercise" text={phase.guidance.exercise} />
          <GuidanceCard icon={Leaf} label="Self-care" text={phase.guidance.selfCare} />
        </div>
      </section>

      <section id="symptom-log" className="mt-5 grid scroll-mt-24 gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <form onSubmit={saveSymptom} className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Local sample form</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">Log a symptom</h3>
              <p className="mt-2 text-sm leading-6 text-[#71908b]">This form only demonstrates the interaction. Nothing is saved beyond this page.</p>
            </div>
            <ClipboardList size={20} className="text-[#397269]" />
          </div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-[#52736f]">
              What would you like to log?
              <select
                value={symptom}
                onChange={(event) => { setSymptom(event.target.value); setSaved(false); }}
                data-testid="select-cycle-symptom"
                className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25"
              >
                <option value="">Choose a symptom</option>
                <option value="Cramps">Cramps</option>
                <option value="Lower energy">Lower energy</option>
                <option value="Headache">Headache</option>
                <option value="Bloating">Bloating</option>
                <option value="Tenderness">Tenderness</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-[#52736f]">
              Note <span className="font-normal text-[#8aa09a]">(optional)</span>
              <textarea
                value={note}
                onChange={(event) => { setNote(event.target.value); setSaved(false); }}
                data-testid="textarea-cycle-symptom-note"
                placeholder="Add a short note"
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              {saved ? <p className="text-xs font-semibold text-[#397269]">Symptom added to this page.</p> : <span />}
              <Button type="submit" disabled={!symptom} data-testid="button-cycle-save-symptom">
                <Plus size={15} /> Add symptom
              </Button>
            </div>
          </div>
        </form>

        <section className="rounded-2xl bg-[#1e6364] p-6 text-[#f7f2e8] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#a9ddc8]">Symptom log</p>
              <h3 className="mt-2 font-display text-2xl">A place to notice patterns.</h3>
            </div>
            <LineChart size={20} className="text-[#a9ddc8]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#c3d8ce]">Your logged symptoms will appear here as you add them.</p>
          <div className="mt-7 rounded-xl bg-[#2c7371] p-5 text-sm text-[#b8d4c8]">
            No symptoms logged yet.
          </div>
        </section>
      </section>
    </div>
  );
}

function GuidanceCard({ icon: Icon, label, text }: { icon: IconType; label: string; text: string }) {
  return (
    <div className="rounded-xl bg-[#f4f1f6]/75 p-4">
      <Icon size={18} className="text-[#615d7c]" />
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#686381]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-[#4e526e]">{text}</p>
    </div>
  );
}

type MenopauseStatus = '' | 'none' | 'perimenopause' | 'menopause' | 'postmenopause';
type PcosStatus = '' | 'yes' | 'no' | 'unsure';
type NutritionProfile = {
  age: string;
  bmi: string;
  phase: CyclePhaseKey | '';
  menopauseStatus: MenopauseStatus;
  pcosStatus: PcosStatus;
};

type NutritionMeal = {
  title: string;
  type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  time: string;
  desc: string;
  tags: string[];
};

const nutritionFilters = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const generalNutritionMeals: NutritionMeal[] = [
  { title: 'Yoghurt, oats & fruit', type: 'Breakfast', time: '10 min', desc: 'A flexible bowl with oats, yoghurt, fruit and seeds.', tags: ['Protein', 'Fibre'] },
  { title: 'Herby lentil bowl', type: 'Lunch', time: '25 min', desc: 'Lentils, greens, roasted vegetables and a lemon dressing.', tags: ['Plant protein', 'Fibre'] },
  { title: 'Apple with nut butter', type: 'Snacks', time: '5 min', desc: 'A simple snack with fruit and a satisfying source of fat.', tags: ['Quick', 'Flexible'] },
  { title: 'Tofu sesame rice', type: 'Dinner', time: '30 min', desc: 'Tofu, rice, greens and vegetables with a sesame dressing.', tags: ['Protein', 'Colour'] },
];

const phaseNutritionMeals: Record<CyclePhaseKey, NutritionMeal[]> = {
  menstrual: [
    { title: 'Warm berry porridge', type: 'Breakfast', time: '15 min', desc: 'Oats with berries, yoghurt or seeds, and a warming spice.', tags: ['Comforting', 'Fibre'] },
    { title: 'Lentil & spinach bowl', type: 'Lunch', time: '25 min', desc: 'Lentils, spinach, roasted vegetables and a bright dressing.', tags: ['Iron-rich', 'Plant protein'] },
    { title: 'Dates with tahini', type: 'Snacks', time: '5 min', desc: 'A small, satisfying combination that can be adjusted to appetite.', tags: ['Quick', 'Flexible'] },
    { title: 'Bean & vegetable stew', type: 'Dinner', time: '35 min', desc: 'Beans, vegetables and wholegrain toast or rice for a gentle meal.', tags: ['Fibre', 'One-pot'] },
  ],
  follicular: [
    { title: 'Yoghurt, oats & fruit', type: 'Breakfast', time: '10 min', desc: 'A fresh bowl with oats, yoghurt, fruit and seeds.', tags: ['Protein', 'Fibre'] },
    { title: 'Herby lentil bowl', type: 'Lunch', time: '25 min', desc: 'Warm lentils, roasted vegetables, greens and lemon tahini.', tags: ['Plant protein', 'Colour'] },
    { title: 'Apple with nut butter', type: 'Snacks', time: '5 min', desc: 'Crisp fruit with a simple, satisfying accompaniment.', tags: ['Quick', 'Flexible'] },
    { title: 'Salmon sesame rice', type: 'Dinner', time: '30 min', desc: 'Salmon or tofu with rice, cucumber, greens and sesame.', tags: ['Protein', 'Omega-3'] },
  ],
  ovulation: [
    { title: 'Egg & avocado toast', type: 'Breakfast', time: '10 min', desc: 'Toast with eggs, avocado and a side of seasonal fruit.', tags: ['Protein', 'Quick'] },
    { title: 'Chickpea grain salad', type: 'Lunch', time: '20 min', desc: 'Chickpeas, grains, crunchy vegetables and a yoghurt dressing.', tags: ['Fibre', 'Colour'] },
    { title: 'Fruit & yoghurt pot', type: 'Snacks', time: '5 min', desc: 'Fruit, yoghurt and seeds in a portion that suits your appetite.', tags: ['Fresh', 'Protein'] },
    { title: 'Tofu vegetable stir-fry', type: 'Dinner', time: '25 min', desc: 'Tofu, vegetables and noodles or rice with a savoury sauce.', tags: ['Protein', 'Flexible'] },
  ],
  luteal: [
    { title: 'Overnight oats', type: 'Breakfast', time: '5 min', desc: 'Oats, yoghurt, fruit and seeds prepared for an easy start.', tags: ['Steady energy', 'Fibre'] },
    { title: 'Sweet potato lentil plate', type: 'Lunch', time: '30 min', desc: 'Sweet potato, lentils, greens and a creamy dressing.', tags: ['Fibre', 'Plant protein'] },
    { title: 'Trail mix & fruit', type: 'Snacks', time: '5 min', desc: 'A flexible mix of nuts, seeds, dried fruit and fresh fruit.', tags: ['Portable', 'Flexible'] },
    { title: 'Wholegrain pasta primavera', type: 'Dinner', time: '25 min', desc: 'Wholegrain pasta with vegetables, beans and olive oil.', tags: ['Comforting', 'Fibre'] },
  ],
};

const menopauseLabels: Record<MenopauseStatus, string> = {
  '': 'Not set',
  none: 'Not menopausal',
  perimenopause: 'Perimenopause',
  menopause: 'Menopause',
  postmenopause: 'Postmenopause',
};

function Nutrition() {
  const [profile, setProfile] = useState<NutritionProfile>({
    age: '',
    bmi: '',
    phase: '',
    menopauseStatus: '',
    pcosStatus: '',
  });
  const [activePhase, setActivePhase] = useState<CyclePhaseKey>('menstrual');
  const [filter, setFilter] = useState('All');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [profileSaved, setProfileSaved] = useState(false);
  const hasCompleteProfile = Boolean(profile.age && profile.bmi && profile.phase && profile.menopauseStatus);
  const phaseLabel = profile.phase ? cyclePhaseData[profile.phase].label : 'Not set';
  const meals = profile.phase ? phaseNutritionMeals[profile.phase] : generalNutritionMeals;
  const shownMeals = filter === 'All' ? meals : meals.filter((meal) => meal.type === filter);
  const currentGuidance = cyclePhaseData[activePhase];

  const updateProfile = (field: keyof NutritionProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileSaved(false);
    if (field === 'phase' && value) setActivePhase(value as CyclePhaseKey);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaved(true);
  };

  const scrollToProfile = () => {
    document.getElementById('nutrition-profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const personalizationItems = [
    `Age: ${profile.age || 'Not set'}`,
    `BMI: ${profile.bmi || 'Not set'}`,
    `Cycle phase: ${phaseLabel}`,
    `Menopause: ${menopauseLabels[profile.menopauseStatus]}`,
  ];

  const pcosMessage = profile.pcosStatus === 'yes'
    ? 'Your profile marks PCOS/PCOD support as relevant. These ideas focus on regular nourishment, balanced plates and flexible movement.'
    : profile.pcosStatus === 'no'
      ? 'Your profile does not currently mark PCOS/PCOD support as relevant. You can update this in your profile anytime.'
      : 'If PCOS/PCOD support is relevant to you, set it in your profile for clearer context. General guidance is shown below.';
  const menopauseMessage = profile.menopauseStatus && profile.menopauseStatus !== 'none'
    ? `Your profile says ${menopauseLabels[profile.menopauseStatus].toLowerCase()} support is relevant. Focus on practical nourishment that fits your preferences and energy.`
    : profile.menopauseStatus === 'none'
      ? 'Your profile does not currently mark menopause support as relevant. You can update this anytime.'
      : 'Set your menopausal status if you want this guidance labelled more clearly. General support is shown below.';

  return (
    <div className="page-enter">
      <SectionTitle
        eyebrow="Food that supports your day"
        title="A plan that meets you where you are."
        description="Use your own profile details to shape flexible meal ideas and supportive nutrition guidance. Nothing here is a diagnosis or a diet prescription."
        action={
          <Button variant="outline" onClick={scrollToProfile} data-testid="button-nutrition-update-profile">
            <Settings size={16} /> Update profile
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Health profile context</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">Recommendations use what you enter.</h3>
            </div>
            <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${hasCompleteProfile ? 'bg-[#e1efea] text-[#397269]' : 'bg-[#f4e8d4] text-[#9b633f]'}`}>
              {hasCompleteProfile ? 'Profile ready' : 'Complete your profile'}
            </span>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {personalizationItems.map((item) => (
              <div key={item} className="rounded-xl bg-[#f0f3ec] px-3.5 py-3 text-xs font-semibold text-[#52736f]">{item}</div>
            ))}
          </div>
          {!hasCompleteProfile && (
            <p className="mt-5 rounded-xl bg-[#edf5ee] px-4 py-3 text-xs leading-5 text-[#52736f]">
              Some details are <span className="font-bold text-[#275b5a]">Not set</span>. Complete your profile below for more relevant context; until then, meal ideas remain general and non-restrictive.
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-[#dceae1] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#52736f]">Daily water tracker</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em] text-[#173b3d]">{waterGlasses} glasses</h3>
            </div>
            <Droplets size={21} className="text-[#397269]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#52736f]">Log water as it suits you today. There is no fixed target here.</p>
          <div className="mt-7 flex items-center gap-3">
            <button type="button" onClick={() => setWaterGlasses((count) => Math.max(0, count - 1))} disabled={waterGlasses === 0} aria-label="Remove one glass of water" data-testid="button-water-remove" className="grid h-10 w-10 place-items-center rounded-lg border border-[#b8d2c1] text-lg font-semibold text-[#397269] hover:bg-[#cfe3d4] disabled:cursor-not-allowed disabled:opacity-40">−</button>
            <div className="flex-1 rounded-lg bg-[#f7f2e8]/75 px-4 py-3 text-center text-xs font-semibold text-[#52736f]">{waterGlasses === 0 ? 'Nothing logged yet' : 'Keep listening to your thirst'}</div>
            <button type="button" onClick={() => setWaterGlasses((count) => count + 1)} aria-label="Add one glass of water" data-testid="button-water-add" className="grid h-10 w-10 place-items-center rounded-lg bg-[#1e6364] text-lg font-semibold text-[#fbf8f0] hover:bg-[#174e50]">+</button>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#66807c]">If you have clinician-provided fluid guidance, follow that instead.</p>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Personalized meal ideas</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">A little steadier.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71908b]">{hasCompleteProfile ? `Using your entered age (${profile.age}), BMI (${profile.bmi}), ${phaseLabel.toLowerCase()} phase and ${menopauseLabels[profile.menopauseStatus].toLowerCase()}. BMI is context only; no weight target is applied.` : profile.age || profile.bmi || profile.phase || profile.menopauseStatus ? 'Some profile details are entered. Complete the remaining fields for more relevant context.' : 'Choose a cycle phase in your profile to make these ideas more relevant.'}</p>
          </div>
          <span className="w-fit rounded-full bg-[#e8f0ea] px-3 py-1.5 text-xs font-bold text-[#397269]">Educational guidance</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {nutritionFilters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} data-testid={`button-nutrition-filter-${item.toLowerCase()}`} className={`rounded-full border px-4 py-2 text-xs font-semibold ${filter === item ? 'border-[#1e6364] bg-[#1e6364] text-[#fbf8f0]' : 'border-[#d7dfd7] bg-[#fbf8f0] text-[#71908b] hover:border-[#9fbdb0]'}`}>{item}</button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {shownMeals.map((meal) => <Meal key={meal.title} {...meal} />)}
        </div>
        {shownMeals.length === 0 && <div className="mt-5 rounded-2xl border border-dashed border-[#cfdacf] p-8 text-center text-sm text-[#71908b]">No ideas in this view yet.</div>}
      </section>

      <section className="mt-5 rounded-2xl bg-[#e4e1eb] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#686381]">Nutrition across the cycle</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em] text-[#34354e]">Four phases, four gentle focuses.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c6077]">Explore general ideas for nutrition, hydration, movement and self-care without treating any phase as a rulebook.</p>
          </div>
          <span className="w-fit rounded-full bg-[#f4f1f6]/75 px-3 py-1.5 text-xs font-bold text-[#615d7c]">No restrictive targets</span>
        </div>
        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {cyclePhaseKeys.map((key) => {
            const item = cyclePhaseData[key];
            const isActive = activePhase === key;
            return (
              <button key={key} type="button" onClick={() => setActivePhase(key)} data-testid={`button-nutrition-phase-${key}`} className={`rounded-xl border p-4 text-left transition-colors ${isActive ? 'border-[#b9b1cd] bg-[#f4f1f6]' : 'border-[#d8d6df] bg-[#f0edf3]/60 hover:border-[#b9b1cd]'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${item.soft}`}><span className={`h-2.5 w-2.5 rounded-full ${item.color}`} /></span>
                  {isActive && <Check size={15} className="text-[#615d7c]" />}
                </div>
                <p className="mt-5 text-sm font-bold text-[#4e526e]">{item.label}</p>
                <div className="mt-4 space-y-2.5 text-xs leading-5 text-[#5c6077]">
                  <p><span className="font-bold text-[#686381]">Nutrition:</span> {item.guidance.nutrition}</p>
                  <p><span className="font-bold text-[#686381]">Hydration:</span> {item.guidance.hydration}</p>
                  <p><span className="font-bold text-[#686381]">Movement:</span> {item.guidance.exercise}</p>
                  <p><span className="font-bold text-[#686381]">Self-care:</span> {item.guidance.selfCare}</p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-5 rounded-xl bg-[#f4f1f6]/75 px-4 py-3 text-xs leading-5 text-[#5c6077]">Currently exploring: <span className="font-bold text-[#4e526e]">{currentGuidance.label}</span>. This selection only changes the educational focus; it does not change your profile until you choose a phase there.</p>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-[#1e6364] p-6 text-[#f7f2e8] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#a9ddc8]">PCOS / PCOD support</p>
              <h3 className="mt-2 font-display text-2xl">Steady, flexible nourishment.</h3>
            </div>
            <Activity size={20} className="text-[#a9ddc8]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#c3d8ce]">{pcosMessage}</p>
          <div className="mt-6 rounded-xl bg-[#2c7371] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a9ddc8]">General ideas</p>
            <p className="mt-2 text-sm leading-6 text-[#e2efe8]">Pair foods you enjoy across protein, fibre, colour and satisfying fats. Regular meals can be useful; the right rhythm is personal.</p>
          </div>
        </section>
        <section className="rounded-2xl bg-[#f2e4d2] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#9b633f]">Menopause support</p>
              <h3 className="mt-2 font-display text-2xl text-[#5d4536]">Nourishment through change.</h3>
            </div>
            <SunMedium size={20} className="text-[#a56744]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6e5646]">{menopauseMessage}</p>
          <div className="mt-6 rounded-xl bg-[#fbf1e3]/80 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#9b633f]">General ideas</p>
            <p className="mt-2 text-sm leading-6 text-[#6e5646]">Include foods that provide protein, calcium, fibre and colour in ways that fit your preferences and culture.</p>
          </div>
        </section>
      </section>

      <form id="nutrition-profile" onSubmit={saveProfile} className="mt-5 scroll-mt-24 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Health profile</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">Keep your context up to date.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71908b]">Enter only what you want to use. These details stay in frontend state for this session and are not sent anywhere.</p>
          </div>
          {profileSaved && <span className="rounded-full bg-[#e1efea] px-3 py-1.5 text-xs font-bold text-[#397269]">Profile updated</span>}
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block text-sm font-semibold text-[#52736f]">
            Age <span className="font-normal text-[#8aa09a]">(optional)</span>
            <input type="number" min="0" max="120" value={profile.age} onChange={(event) => updateProfile('age', event.target.value)} placeholder="Not set" data-testid="input-nutrition-age" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" />
          </label>
          <label className="block text-sm font-semibold text-[#52736f]">
            BMI <span className="font-normal text-[#8aa09a]">(optional)</span>
            <input type="number" min="0" max="100" step="0.1" value={profile.bmi} onChange={(event) => updateProfile('bmi', event.target.value)} placeholder="Not set" data-testid="input-nutrition-bmi" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" />
          </label>
          <label className="block text-sm font-semibold text-[#52736f]">
            Menstrual phase
            <select value={profile.phase} onChange={(event) => updateProfile('phase', event.target.value)} data-testid="select-nutrition-phase" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25">
              <option value="">Not set</option>
              {cyclePhaseKeys.map((key) => <option key={key} value={key}>{cyclePhaseData[key].label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#52736f]">
            Menopausal status
            <select value={profile.menopauseStatus} onChange={(event) => updateProfile('menopauseStatus', event.target.value)} data-testid="select-nutrition-menopause" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25">
              <option value="">Not set</option>
              <option value="none">Not menopausal</option>
              <option value="perimenopause">Perimenopause</option>
              <option value="menopause">Menopause</option>
              <option value="postmenopause">Postmenopause</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#52736f]">
            PCOS / PCOD
            <select value={profile.pcosStatus} onChange={(event) => updateProfile('pcosStatus', event.target.value)} data-testid="select-nutrition-pcos" className="mt-2 w-full rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25">
              <option value="">Not set</option>
              <option value="yes">Relevant to me</option>
              <option value="no">Not relevant</option>
              <option value="unsure">Not sure</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#e7ebe2] pt-5 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-xs leading-5 text-[#8aa09a]">No calorie target, weight-loss target or restrictive diet is used. If you have a health condition or clinician-provided plan, use that as your primary guidance.</p>
          <Button type="submit" data-testid="button-nutrition-save-profile"><Check size={15} /> Save profile details</Button>
        </div>
      </form>
    </div>
  );
}
function Anchor({ title, detail, done = false }: { title: string; detail: string; done?: boolean }) { return <div className="flex items-center gap-3 rounded-xl bg-[#2c7371] p-3.5"><span className={`grid h-8 w-8 place-items-center rounded-full ${done ? 'bg-[#9bd6c2] text-[#173b3d]' : 'border border-[#70a99a] text-[#a9ddc8]'}`}>{done ? <Check size={15} /> : <span className="text-xs"> </span>}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-[#b8d4c8]">{detail}</p></div></div>; }
function Meal({ title, type, time, desc, tags }: { title: string; type: string; time: string; desc: string; tags: string[] }) { return <button data-testid={`button-meal-${title.toLowerCase().replaceAll(' ', '-')}`} className="group flex w-full items-center justify-between rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-4 text-left shadow-card hover:border-[#9fbdb0]"><div className="flex items-center gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#f2e4d2] text-[#a56744]"><Leaf size={21} /></div><div><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold text-[#356562]">{title}</h4><span className="text-[10px] font-bold uppercase tracking-wider text-[#9aaba3]">{type}</span></div><p className="mt-1 text-xs leading-5 text-[#78908a]">{desc}</p><div className="mt-2 flex gap-1.5">{tags.map((tag) => <span key={tag} className="rounded-full bg-[#edf5ee] px-2 py-0.5 text-[10px] font-semibold text-[#52736f]">{tag}</span>)}</div></div></div><ChevronRight size={17} className="shrink-0 text-[#8aa09a] transition-transform group-hover:translate-x-1" /></button>; }

type PcosSupportMode = 'not-selected' | 'using' | 'not-now';
type PcosSymptomEntry = { id: number; symptoms: string[]; note: string; date: string };
type PcosWeightEntry = { id: number; weight: string; unit: 'kg' | 'lb'; date: string };

const pcosSymptomOptions = [
  'Cycle changes',
  'Acne or skin changes',
  'Hair changes',
  'Pelvic discomfort',
  'Fatigue',
  'Mood changes',
  'Bloating',
  'Sleep changes',
];

const pcosMealIdeas = [
  { title: 'Yoghurt, oats & fruit', desc: 'A flexible breakfast with protein, fibre, fruit and seeds.', tags: ['Breakfast', 'Fibre'] },
  { title: 'Lentil grain bowl', desc: 'Lentils, grains, greens and vegetables with a dressing you enjoy.', tags: ['Lunch', 'Plant protein'] },
  { title: 'Egg or bean toast', desc: 'Wholegrain toast with eggs or beans and a side of colour.', tags: ['Quick', 'Flexible'] },
  { title: 'Tofu vegetable stir-fry', desc: 'Tofu, vegetables and rice or noodles with a satisfying sauce.', tags: ['Dinner', 'Balanced'] },
];

const pcosMovementIdeas = [
  { title: 'Walking', detail: 'A short walk can be a useful way to add movement without making the day more demanding.', icon: Activity },
  { title: 'Yoga', detail: 'Choose a gentle or flowing practice that feels supportive rather than punishing.', icon: Leaf },
  { title: 'Stretching', detail: 'Try a few minutes of easy mobility when you want a low-pressure reset.', icon: MoveRight },
  { title: 'Strength training', detail: 'Build gradually with bodyweight, bands or weights at a pace that suits you.', icon: Dumbbell },
];

function getPcosEntryDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function PcosSupport() {
  const [mode, setMode] = useState<PcosSupportMode>('not-selected');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomNote, setSymptomNote] = useState('');
  const [symptomEntries, setSymptomEntries] = useState<PcosSymptomEntry[]>([]);
  const [symptomSaved, setSymptomSaved] = useState(false);
  const [weightTrackingEnabled, setWeightTrackingEnabled] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [weightEntries, setWeightEntries] = useState<PcosWeightEntry[]>([]);
  const [weightSaved, setWeightSaved] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]);
    setSymptomSaved(false);
  };

  const saveSymptomEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedSymptoms.length === 0) return;
    setSymptomEntries((current) => [
      {
        id: Date.now(),
        symptoms: selectedSymptoms,
        note: symptomNote.trim(),
        date: getPcosEntryDateLabel(),
      },
      ...current,
    ]);
    setSelectedSymptoms([]);
    setSymptomNote('');
    setSymptomSaved(true);
  };

  const saveWeightEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!weight.trim()) return;
    setWeightEntries((current) => [
      { id: Date.now(), weight: weight.trim(), unit: weightUnit, date: getPcosEntryDateLabel() },
      ...current,
    ]);
    setWeight('');
    setWeightSaved(true);
  };

  const latestWeight = weightEntries[0];
  const earliestWeight = weightEntries[weightEntries.length - 1];
  const weightDifference = latestWeight && earliestWeight && weightEntries.length > 1
    ? Number(latestWeight.weight) - Number(earliestWeight.weight)
    : null;

  if (mode !== 'using') {
    return (
      <div className="page-enter">
        <section className="relative overflow-hidden rounded-3xl bg-[#e6e1eb] p-7 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#615d7c]">Optional support space</p>
            <h2 className="mt-3 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#34354e] md:text-6xl">Support that starts with your choice.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#5c6077]">This page is here if tracking symptoms, exploring balanced routines or keeping personal notes would feel useful. It does not assume you have PCOS/PCOD, and it does not diagnose or treat.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setMode('using')} data-testid="button-pcos-opt-in"><Activity size={16} /> Use this support space</Button>
              <Button variant="outline" onClick={() => setMode('not-now')} data-testid="button-pcos-not-now">Not right now</Button>
            </div>
          </div>
          <div className="absolute -bottom-16 -right-12 grid h-64 w-64 place-items-center rounded-full border border-[#ffffff]/60">
            <div className="grid h-44 w-44 place-items-center rounded-full border border-[#ffffff]/70"><Activity size={44} className="text-[#686381]" /></div>
          </div>
        </section>
        <section className="mt-6 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#397269]" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">A clear boundary</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">You decide what belongs here.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71908b]">Nothing is pre-filled. If you choose to use this space, only the symptoms, notes and optional weight entries you add will appear during this session.</p>
            </div>
          </div>
          {mode === 'not-now' && (
            <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-[#edf5ee] p-4 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-[#52736f]">This support space is paused. You can return whenever it feels useful.</p>
              <button type="button" onClick={() => setMode('using')} className="w-fit rounded-lg px-3 py-2 text-sm font-bold text-[#397269] hover:bg-[#dfeee2]" data-testid="button-pcos-reopen">Use it now</button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden rounded-3xl bg-[#e6e1eb] p-7 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#615d7c]">Your optional support space</p>
          <h2 className="mt-3 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#34354e] md:text-6xl">Make space for what you notice.</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#5c6077]">Use this private-on-the-page workspace to notice symptoms, explore balanced routines and keep progress notes that are meaningful to you.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#f4f1f6]/80 px-3 py-1.5 text-xs font-bold text-[#615d7c]">No diagnosis here</span>
            <button type="button" onClick={() => setMode('not-now')} className="rounded-lg px-3 py-2 text-xs font-bold text-[#615d7c] hover:bg-[#f4f1f6]/70" data-testid="button-pcos-stop-using">Stop using this section</button>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-12 grid h-64 w-64 place-items-center rounded-full border border-[#ffffff]/60">
          <div className="grid h-44 w-44 place-items-center rounded-full border border-[#ffffff]/70"><Activity size={44} className="text-[#686381]" /></div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#71908b]">Symptom entries</p><ClipboardList size={18} className="text-[#397269]" /></div>
          <p className="mt-5 font-display text-4xl tracking-[-.04em]">{symptomEntries.length}</p>
          <p className="mt-1 text-xs text-[#78908a]">{symptomEntries.length === 0 ? 'Nothing logged yet' : 'Created on this page'}</p>
        </div>
        <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#71908b]">Weight entries</p><Scale size={18} className="text-[#397269]" /></div>
          <p className="mt-5 font-display text-4xl tracking-[-.04em]">{weightTrackingEnabled ? weightEntries.length : '—'}</p>
          <p className="mt-1 text-xs text-[#78908a]">{weightTrackingEnabled ? (weightEntries.length === 0 ? 'Optional tracker is empty' : 'Created on this page') : 'Optional and turned off'}</p>
        </div>
        <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#71908b]">Latest check-in</p><HeartPulse size={18} className="text-[#397269]" /></div>
          <p className="mt-5 font-display text-2xl tracking-[-.04em]">{symptomEntries[0]?.date || weightEntries[0]?.date || 'Not yet'}</p>
          <p className="mt-1 text-xs text-[#78908a]">Only your entries appear here</p>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <form onSubmit={saveSymptomEntry} className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Symptom tracker</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">What would you like to notice?</h3>
              <p className="mt-2 text-sm leading-6 text-[#71908b]">Select anything that feels relevant today. These options are for personal tracking, not diagnosis.</p>
            </div>
            <ClipboardList size={21} className="shrink-0 text-[#397269]" />
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {pcosSymptomOptions.map((symptom) => {
              const selected = selectedSymptoms.includes(symptom);
              return (
                <button key={symptom} type="button" onClick={() => toggleSymptom(symptom)} aria-pressed={selected} data-testid={`button-pcos-symptom-${symptom.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${selected ? 'border-[#4a9a83] bg-[#e9f3eb] text-[#1e6364]' : 'border-[#e0e5dc] bg-[#fbf8f0] text-[#52736f] hover:border-[#9fbdb0]'}`}>
                  <span>{symptom}</span>
                  {selected ? <span className="grid h-5 w-5 place-items-center rounded-full bg-[#4a9a83] text-white"><Check size={13} /></span> : <span className="h-5 w-5 rounded-full border border-[#cad8cd]" />}
                </button>
              );
            })}
          </div>
          <label className="mt-6 block text-sm font-semibold text-[#52736f]">
            Notes <span className="font-normal text-[#8aa09a]">(optional)</span>
            <textarea value={symptomNote} onChange={(event) => { setSymptomNote(event.target.value); setSymptomSaved(false); }} placeholder="What else would be useful to remember?" rows={3} data-testid="textarea-pcos-symptom-note" className="mt-2 w-full resize-none rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" />
          </label>
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e7ebe2] pt-5 sm:flex-row sm:items-center">
            {symptomSaved ? <p className="text-xs font-semibold text-[#397269]">Entry added to this page.</p> : <p className="text-xs text-[#8aa09a]">{selectedSymptoms.length === 0 ? 'Choose at least one option to save.' : `${selectedSymptoms.length} selected`}</p>}
            <Button type="submit" disabled={selectedSymptoms.length === 0} data-testid="button-pcos-save-symptom"><Plus size={15} /> Save symptom entry</Button>
          </div>
        </form>

        <section className="rounded-2xl bg-[#1e6364] p-6 text-[#f7f2e8] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#a9ddc8]">Logged symptoms</p>
              <h3 className="mt-2 font-display text-3xl">Your notes, in one place.</h3>
            </div>
            <LineChart size={21} className="text-[#a9ddc8]" />
          </div>
          {symptomEntries.length === 0 ? (
            <div className="mt-7 rounded-xl bg-[#2c7371] p-5">
              <p className="text-sm font-semibold text-[#e2efe8]">No symptom entries yet.</p>
              <p className="mt-2 text-xs leading-5 text-[#b8d4c8]">Saved entries will appear here. Start only when you want to.</p>
            </div>
          ) : (
            <div className="mt-7 space-y-3">
              {symptomEntries.map((entry) => (
                <article key={entry.id} className="rounded-xl bg-[#2c7371] p-4">
                  <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-[#f7f2e8]">{entry.symptoms.join(' · ')}</p><span className="shrink-0 text-[10px] text-[#b8d4c8]">{entry.date}</span></div>
                  {entry.note && <p className="mt-2 text-xs leading-5 text-[#c9dfd4]">{entry.note}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="mt-6 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Optional health monitoring</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">Keep weight tracking on your terms.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71908b]">Weight is optional, personal and not a measure of progress by itself. Turn this on only if recording it feels useful to you.</p>
          </div>
          <button type="button" onClick={() => { setWeightTrackingEnabled((current) => !current); setWeightSaved(false); }} className={`w-fit rounded-lg px-3 py-2 text-xs font-bold ${weightTrackingEnabled ? 'bg-[#e1efea] text-[#397269]' : 'bg-[#e8eee8] text-[#52736f]'}`} data-testid="button-pcos-toggle-weight">
            {weightTrackingEnabled ? 'Weight tracking on' : 'Use weight tracking'}
          </button>
        </div>
        {!weightTrackingEnabled ? (
          <div className="mt-6 rounded-xl bg-[#edf5ee] p-5 text-sm leading-6 text-[#52736f]">This section is currently empty because optional weight tracking is off. You can still use symptom notes, food ideas and movement guidance without it.</div>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <form onSubmit={saveWeightEntry} className="rounded-xl bg-[#edf5ee] p-5">
              <div className="flex items-center gap-2"><Scale size={18} className="text-[#397269]" /><p className="text-sm font-bold text-[#275b5a]">Add a weight entry</p></div>
              <label className="mt-5 block text-sm font-semibold text-[#52736f]">
                Weight
                <div className="mt-2 flex gap-2">
                  <input type="number" min="0" step="0.1" value={weight} onChange={(event) => { setWeight(event.target.value); setWeightSaved(false); }} placeholder="Enter a value" data-testid="input-pcos-weight" className="min-w-0 flex-1 rounded-lg border border-[#cbded0] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal outline-none placeholder:text-[#a0b0aa] focus:border-[#1e6364] focus:ring-4 focus:ring-[#9bd6c2]/25" />
                  <select value={weightUnit} onChange={(event) => setWeightUnit(event.target.value as 'kg' | 'lb')} data-testid="select-pcos-weight-unit" className="rounded-lg border border-[#cbded0] bg-[#fbf8f0] px-3 py-3 text-sm font-normal text-[#52736f] outline-none focus:border-[#1e6364]">
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </label>
              <div className="mt-5 flex items-center justify-between gap-3">
                {weightSaved ? <p className="text-xs font-semibold text-[#397269]">Weight entry added.</p> : <span />}
                <Button type="submit" disabled={!weight.trim()}><Plus size={15} /> Save weight</Button>
              </div>
            </form>
            <div>
              <div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#71908b]">Personal progress</p><h4 className="mt-2 font-display text-2xl">Your recorded history.</h4></div><LineChart size={20} className="text-[#397269]" /></div>
              {weightEntries.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#cfdacf] p-6 text-sm leading-6 text-[#71908b]">No weight entries yet. Add one if you want a personal starting point.</div>
              ) : (
                <div className="mt-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-[#f0f3ec] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#71908b]">First logged</p><p className="mt-2 font-display text-2xl">{earliestWeight?.weight} {earliestWeight?.unit}</p></div>
                    <div className="rounded-xl bg-[#f0f3ec] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#71908b]">Latest logged</p><p className="mt-2 font-display text-2xl">{latestWeight?.weight} {latestWeight?.unit}</p></div>
                    <div className="rounded-xl bg-[#f0f3ec] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#71908b]">Recorded change</p><p className="mt-2 font-display text-2xl">{weightDifference === null || Number.isNaN(weightDifference) ? '—' : `${weightDifference > 0 ? '+' : ''}${weightDifference.toFixed(1)} ${latestWeight?.unit}`}</p></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {weightEntries.map((entry) => <div key={entry.id} className="flex items-center justify-between rounded-lg border border-[#e4e8df] px-4 py-3 text-sm"><span className="font-semibold text-[#52736f]">{entry.weight} {entry.unit}</span><span className="text-xs text-[#8aa09a]">{entry.date}</span></div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-2xl bg-[#dceae1] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#52736f]">Balanced nutrition</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">Build meals, not rules.</h3>
            </div>
            <Utensils size={21} className="text-[#397269]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#52736f]">A flexible plate can include protein, fibre, satisfying fats, carbohydrates and colour. Your preferences, culture, budget and appetite matter.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pcosMealIdeas.map((meal) => <div key={meal.title} className="rounded-xl bg-[#f7f2e8]/75 p-4"><p className="text-sm font-bold text-[#275b5a]">{meal.title}</p><p className="mt-2 text-xs leading-5 text-[#66807c]">{meal.desc}</p><div className="mt-3 flex gap-1.5">{meal.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e1efea] px-2 py-0.5 text-[10px] font-semibold text-[#52736f]">{tag}</span>)}</div></div>)}
          </div>
        </section>
        <section className="rounded-2xl bg-[#f2e4d2] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#9b633f]">Gentle movement</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em] text-[#5d4536]">Choose what feels possible.</h3>
            </div>
            <Dumbbell size={21} className="text-[#a56744]" />
          </div>
          <div className="mt-6 space-y-3">
            {pcosMovementIdeas.map(({ title, detail, icon: Icon }) => <div key={title} className="flex gap-3 rounded-xl bg-[#fbf1e3]/80 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#f7e6cf] text-[#a56744]"><Icon size={17} /></span><div><p className="text-sm font-bold text-[#6e5646]">{title}</p><p className="mt-1 text-xs leading-5 text-[#806657]">{detail}</p></div></div>)}
          </div>
        </section>
      </section>

      <p className="mt-6 rounded-xl border border-[#dfe5db] bg-[#fbf8f0] px-4 py-3 text-xs leading-5 text-[#8aa09a]">This page offers general educational support only. If you are worried about symptoms or changes in your health, a qualified clinician can help you decide what to do next.</p>
    </div>
  );
}

type MenopauseSupportMode = 'not-selected' | 'using' | 'not-now';
type MenopauseSymptomEntry = { id: number; experiences: string[]; note: string; date: string };

const menopauseExperienceOptions = [
  'Sleep changes',
  'Hot flashes',
  'Mood changes',
  'Fatigue',
  'Night waking',
  'Focus changes',
  'Body aches',
  'Other experience',
];

const menopauseMealIdeas = [
  { title: 'Yoghurt, oats & fruit', desc: 'A flexible breakfast with protein, fibre, fruit and seeds.', tags: ['Breakfast', 'Fibre'] },
  { title: 'Bean & grain bowl', desc: 'Beans, whole grains, greens and vegetables with a dressing you enjoy.', tags: ['Lunch', 'Plant protein'] },
  { title: 'Hummus, toast & colour', desc: 'Wholegrain toast, hummus and fresh vegetables for an easy meal.', tags: ['Quick', 'Flexible'] },
  { title: 'Salmon or tofu tray bake', desc: 'A simple combination of protein, vegetables and potatoes or grains.', tags: ['Dinner', 'Balanced'] },
];

const menopauseLifestyleIdeas = [
  { title: 'Sleep support', detail: 'Keep a steady wind-down routine, make the room comfortable and notice what helps your rest.', icon: Moon },
  { title: 'Stress care', detail: 'Try a brief breathing pause, a quiet walk or a small boundary that protects your energy.', icon: HeartPulse },
  { title: 'Self-care', detail: 'Make room for comfort, connection and clinician conversations when you want more support.', icon: Leaf },
];

const menopauseMovementIdeas = [
  { title: 'Walking', detail: 'A short walk can support a gentle rhythm of movement without making the day more demanding.', icon: Activity },
  { title: 'Yoga', detail: 'Choose a restorative or flowing practice that feels steady and supportive.', icon: Leaf },
  { title: 'Stretching', detail: 'Use a few minutes of easy mobility when you want a low-pressure reset.', icon: MoveRight },
  { title: 'Strength training', detail: 'Build gradually with bodyweight, bands or weights at a pace that suits you.', icon: Dumbbell },
];

function MenopauseSupport() {
  const [mode, setMode] = useState<MenopauseSupportMode>('not-selected');
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [experienceNote, setExperienceNote] = useState('');
  const [entries, setEntries] = useState<MenopauseSymptomEntry[]>([]);
  const [entrySaved, setEntrySaved] = useState(false);

  const toggleExperience = (experience: string) => {
    setSelectedExperiences((current) => current.includes(experience) ? current.filter((item) => item !== experience) : [...current, experience]);
    setEntrySaved(false);
  };

  const saveEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedExperiences.length === 0) return;
    setEntries((current) => [
      {
        id: Date.now(),
        experiences: selectedExperiences,
        note: experienceNote.trim(),
        date: getPcosEntryDateLabel(),
      },
      ...current,
    ]);
    setSelectedExperiences([]);
    setExperienceNote('');
    setEntrySaved(true);
  };

  const uniqueExperiences = [...new Set(entries.flatMap((entry) => entry.experiences))];

  if (mode !== 'using') {
    return (
      <div className="page-enter">
        <section className="relative overflow-hidden rounded-3xl bg-[#f2e4d2] p-7 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9b633f]">Optional support space</p>
            <h2 className="mt-3 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#5d4536] md:text-6xl">Support for change, at your pace.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#6e5646]">This page is here if noticing sleep, energy, mood or other experiences would feel useful. It does not assume you are experiencing menopause, and it does not diagnose or treat.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setMode('using')} data-testid="button-menopause-opt-in"><SunMedium size={16} /> Use this support space</Button>
              <Button variant="outline" onClick={() => setMode('not-now')} data-testid="button-menopause-not-now">Not right now</Button>
            </div>
          </div>
          <div className="absolute -bottom-16 -right-12 grid h-64 w-64 place-items-center rounded-full border border-[#ffffff]/60">
            <div className="grid h-44 w-44 place-items-center rounded-full border border-[#ffffff]/70"><SunMedium size={44} className="text-[#a56744]" /></div>
          </div>
        </section>
        <section className="mt-6 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#397269]" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#71908b]">A clear boundary</p>
              <h3 className="mt-2 font-display text-2xl tracking-[-.03em]">You decide what belongs here.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71908b]">Nothing is pre-filled. If you choose to use this space, only the experiences and notes you add will appear during this session.</p>
            </div>
          </div>
          {mode === 'not-now' && (
            <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-[#edf5ee] p-4 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-[#52736f]">This support space is paused. You can return whenever it feels useful.</p>
              <button type="button" onClick={() => setMode('using')} className="w-fit rounded-lg px-3 py-2 text-sm font-bold text-[#397269] hover:bg-[#dfeee2]" data-testid="button-menopause-reopen">Use it now</button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden rounded-3xl bg-[#f2e4d2] p-7 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9b633f]">Your optional support space</p>
          <h2 className="mt-3 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#5d4536] md:text-6xl">Notice what is changing, gently.</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#6e5646]">Use this page to notice your own experiences, explore balanced routines and keep notes that may help you see patterns over time.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#fbf1e3]/80 px-3 py-1.5 text-xs font-bold text-[#9b633f]">No diagnosis here</span>
            <button type="button" onClick={() => setMode('not-now')} className="rounded-lg px-3 py-2 text-xs font-bold text-[#9b633f] hover:bg-[#fbf1e3]/70" data-testid="button-menopause-stop-using">Stop using this section</button>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-12 grid h-64 w-64 place-items-center rounded-full border border-[#ffffff]/60">
          <div className="grid h-44 w-44 place-items-center rounded-full border border-[#ffffff]/70"><SunMedium size={44} className="text-[#a56744]" /></div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#71908b]">Symptom entries</p><ClipboardList size={18} className="text-[#397269]" /></div>
          <p className="mt-5 font-display text-4xl tracking-[-.04em]">{entries.length}</p>
          <p className="mt-1 text-xs text-[#78908a]">{entries.length === 0 ? 'Nothing logged yet' : 'Created on this page'}</p>
        </div>
        <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#71908b]">Experiences noted</p><LineChart size={18} className="text-[#397269]" /></div>
          <p className="mt-5 font-display text-4xl tracking-[-.04em]">{uniqueExperiences.length}</p>
          <p className="mt-1 text-xs text-[#78908a]">{uniqueExperiences.length === 0 ? 'No personal history yet' : 'Unique options you logged'}</p>
        </div>
        <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#71908b]">Latest check-in</p><HeartPulse size={18} className="text-[#397269]" /></div>
          <p className="mt-5 font-display text-2xl tracking-[-.04em]">{entries[0]?.date || 'Not yet'}</p>
          <p className="mt-1 text-xs text-[#78908a]">Only your entries appear here</p>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <form onSubmit={saveEntry} className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Symptom tracker</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">What would you like to notice?</h3>
              <p className="mt-2 text-sm leading-6 text-[#71908b]">Select anything that feels relevant today. These options are for personal tracking, not diagnosis.</p>
            </div>
            <ClipboardList size={21} className="shrink-0 text-[#397269]" />
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {menopauseExperienceOptions.map((experience) => {
              const selected = selectedExperiences.includes(experience);
              return (
                <button key={experience} type="button" onClick={() => toggleExperience(experience)} aria-pressed={selected} data-testid={`button-menopause-experience-${experience.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${selected ? 'border-[#c78b63] bg-[#fbf1e3] text-[#8e5b3d]' : 'border-[#e0e5dc] bg-[#fbf8f0] text-[#52736f] hover:border-[#c9a17f]'}`}>
                  <span>{experience}</span>
                  {selected ? <span className="grid h-5 w-5 place-items-center rounded-full bg-[#b47758] text-white"><Check size={13} /></span> : <span className="h-5 w-5 rounded-full border border-[#cad8cd]" />}
                </button>
              );
            })}
          </div>
          <label className="mt-6 block text-sm font-semibold text-[#52736f]">
            Notes <span className="font-normal text-[#8aa09a]">(optional)</span>
            <textarea value={experienceNote} onChange={(event) => { setExperienceNote(event.target.value); setEntrySaved(false); }} placeholder="What else would be useful to remember?" rows={3} data-testid="textarea-menopause-note" className="mt-2 w-full resize-none rounded-lg border border-[#d7dfd7] bg-[#fbf8f0] px-3.5 py-3 text-sm font-normal text-[#52736f] outline-none placeholder:text-[#a0b0aa] focus:border-[#b47758] focus:ring-4 focus:ring-[#e8c7a8]/30" />
          </label>
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e7ebe2] pt-5 sm:flex-row sm:items-center">
            {entrySaved ? <p className="text-xs font-semibold text-[#397269]">Entry added to this page.</p> : <p className="text-xs text-[#8aa09a]">{selectedExperiences.length === 0 ? 'Choose at least one option to save.' : `${selectedExperiences.length} selected`}</p>}
            <Button type="submit" disabled={selectedExperiences.length === 0} data-testid="button-menopause-save-entry"><Plus size={15} /> Save symptom entry</Button>
          </div>
        </form>

        <section className="rounded-2xl bg-[#1e6364] p-6 text-[#f7f2e8] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#a9ddc8]">Symptom history</p>
              <h3 className="mt-2 font-display text-3xl">Your notes, in one place.</h3>
            </div>
            <LineChart size={21} className="text-[#a9ddc8]" />
          </div>
          {entries.length === 0 ? (
            <div className="mt-7 rounded-xl bg-[#2c7371] p-5">
              <p className="text-sm font-semibold text-[#e2efe8]">No symptom entries yet.</p>
              <p className="mt-2 text-xs leading-5 text-[#b8d4c8]">Saved entries will appear here. Start only when you want to.</p>
            </div>
          ) : (
            <div className="mt-7 space-y-3">
              {entries.map((entry) => (
                <article key={entry.id} className="rounded-xl bg-[#2c7371] p-4">
                  <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-[#f7f2e8]">{entry.experiences.join(' · ')}</p><span className="shrink-0 text-[10px] text-[#b8d4c8]">{entry.date}</span></div>
                  {entry.note && <p className="mt-2 text-xs leading-5 text-[#c9dfd4]">{entry.note}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-2xl bg-[#dceae1] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#52736f]">Balanced nutrition</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">Build meals, not rules.</h3>
            </div>
            <Utensils size={21} className="text-[#397269]" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#52736f]">A flexible plate can include protein, fibre, satisfying fats, carbohydrates and colour. Include calcium-containing foods if they suit your preferences, culture and needs.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {menopauseMealIdeas.map((meal) => <div key={meal.title} className="rounded-xl bg-[#f7f2e8]/75 p-4"><p className="text-sm font-bold text-[#275b5a]">{meal.title}</p><p className="mt-2 text-xs leading-5 text-[#66807c]">{meal.desc}</p><div className="mt-3 flex gap-1.5">{meal.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e1efea] px-2 py-0.5 text-[10px] font-semibold text-[#52736f]">{tag}</span>)}</div></div>)}
          </div>
        </section>
        <section className="rounded-2xl bg-[#f2e4d2] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#9b633f]">Lifestyle support</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-.03em] text-[#5d4536]">Small supports can matter.</h3>
            </div>
            <HeartPulse size={21} className="text-[#a56744]" />
          </div>
          <div className="mt-6 space-y-3">
            {menopauseLifestyleIdeas.map(({ title, detail, icon: Icon }) => <div key={title} className="flex gap-3 rounded-xl bg-[#fbf1e3]/80 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#f7e6cf] text-[#a56744]"><Icon size={17} /></span><div><p className="text-sm font-bold text-[#6e5646]">{title}</p><p className="mt-1 text-xs leading-5 text-[#806657]">{detail}</p></div></div>)}
          </div>
        </section>
      </section>

      <section className="mt-6 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Gentle fitness</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em]">Choose what feels possible.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71908b]">There is no single right level of movement. Adjust for your energy, comfort and any advice you have received from a qualified professional.</p>
          </div>
          <Dumbbell size={21} className="text-[#397269]" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {menopauseMovementIdeas.map(({ title, detail, icon: Icon }) => <div key={title} className="rounded-xl bg-[#edf5ee] p-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e1efea] text-[#397269]"><Icon size={17} /></span><p className="mt-5 text-sm font-bold text-[#275b5a]">{title}</p><p className="mt-2 text-xs leading-5 text-[#66807c]">{detail}</p></div>)}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-[#e4e1eb] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#686381]">Personal progress</p>
            <h3 className="mt-2 font-display text-3xl tracking-[-.03em] text-[#34354e]">Notice your own patterns.</h3>
          </div>
          <Target size={21} className="text-[#615d7c]" />
        </div>
        {entries.length === 0 ? (
          <div className="mt-6 rounded-xl bg-[#f4f1f6]/75 p-5 text-sm leading-6 text-[#5c6077]">Your progress view is empty for now. Once you save entries, this space will summarize your own history rather than showing sample data.</div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f4f1f6]/75 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#686381]">Check-ins</p><p className="mt-2 font-display text-3xl text-[#34354e]">{entries.length}</p><p className="mt-1 text-xs text-[#5c6077]">saved this session</p></div>
            <div className="rounded-xl bg-[#f4f1f6]/75 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#686381]">Experiences</p><p className="mt-2 font-display text-3xl text-[#34354e]">{uniqueExperiences.length}</p><p className="mt-1 text-xs text-[#5c6077]">different options noted</p></div>
            <div className="rounded-xl bg-[#f4f1f6]/75 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#686381]">Latest entry</p><p className="mt-2 font-display text-2xl text-[#34354e]">{entries[0].date}</p><p className="mt-1 text-xs text-[#5c6077]">your most recent check-in</p></div>
          </div>
        )}
      </section>

      <p className="mt-6 rounded-xl border border-[#dfe5db] bg-[#fbf8f0] px-4 py-3 text-xs leading-5 text-[#8aa09a]">This page offers general educational support only. If you are worried about symptoms or changes in your health, a qualified clinician can help you decide what to do next.</p>
    </div>
  );
}

function CarePage({ type }: { type: 'pcos' | 'menopause' | 'hygiene' | 'fitness' }) {
  const details = { pcos: { eyebrow: 'Support without the noise', title: 'Your body is not a problem to solve.', desc: 'A grounded library for understanding PCOS / PCOD, building sustainable routines and finding questions to bring to your clinician.', bg: 'bg-[#e6e1eb]', icon: Activity, stat: '1 in 10', statText: 'people with ovaries experience PCOS' }, menopause: { eyebrow: 'A new chapter, not an ending', title: 'Care for change, at your pace.', desc: 'Practical support for the transition through perimenopause and menopause — from sleep and energy to confidence in conversations.', bg: 'bg-[#f2e4d2]', icon: SunMedium, stat: '34+', statText: 'common experiences to make sense of' }, hygiene: { eyebrow: 'Comfort, care, confidence', title: 'The basics deserve better answers.', desc: 'Clear, shame-free guidance for menstrual hygiene, products, skin comfort and looking after yourself on every kind of day.', bg: 'bg-[#dceae1]', icon: Droplets, stat: '24 hr', statText: 'is the longest to leave a tampon in' }, fitness: { eyebrow: 'Move in a way that fits', title: 'Strength can feel like care.', desc: 'Short, adaptable movement and self-care practices for your energy today — not a version of you that does not exist.', bg: 'bg-[#e1e4ee]', icon: Dumbbell, stat: '08 min', statText: 'is enough for a meaningful reset' } }[type]; const Icon = details.icon; return <div className="page-enter"><div className={`relative overflow-hidden rounded-3xl ${details.bg} p-7 md:p-12`}><div className="relative z-10 max-w-2xl"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#52736f]">{details.eyebrow}</p><h2 className="mt-3 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#173b3d] md:text-6xl">{details.title}</h2><p className="mt-6 max-w-xl text-sm leading-7 text-[#5f7975]">{details.desc}</p><div className="mt-8 flex flex-wrap gap-3"><Button data-testid={`button-${type}-start`}><BookOpen size={16} /> Start with the guide</Button><Button variant="outline" data-testid={`button-${type}-save`}><Plus size={16} /> Save for later</Button></div></div><div className="absolute -bottom-16 -right-12 grid h-64 w-64 place-items-center rounded-full border border-[#ffffff]/60"><div className="grid h-44 w-44 place-items-center rounded-full border border-[#ffffff]/70"><Icon size={44} className="text-[#52736f]" /></div></div></div><div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><section className="rounded-2xl bg-[#173b3d] p-6 text-[#f7f2e8]"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#9bd6c2]">Worth knowing</p><p className="mt-4 font-display text-5xl">{details.stat}</p><p className="mt-2 max-w-[210px] text-sm leading-6 text-[#b8cec4]">{details.statText}.</p><Link href="/progress" data-testid={`link-${type}-progress`} className="mt-7 inline-flex items-center gap-1 text-xs font-bold text-[#a9ddc8]">Track your experience <ArrowRight size={13} /></Link></section><section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-7"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Explore next</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><Guide title={type === 'pcos' ? 'Understanding symptoms' : type === 'menopause' ? 'What is changing?' : type === 'hygiene' ? 'Products, simply' : 'Low-energy movement'} icon={BookOpen} /><Guide title={type === 'pcos' ? 'Questions for your doctor' : type === 'menopause' ? 'Sleep & temperature' : type === 'hygiene' ? 'Skin comfort' : 'Build a reset ritual'} icon={CircleHelp} /><Guide title={type === 'pcos' ? 'Steady routines' : type === 'menopause' ? 'Strength & bone health' : type === 'hygiene' ? 'When to get help' : 'Recovery matters'} icon={Sparkles} /></div></section></div><section className="mt-6 rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">A note from Nourish Her</p><h3 className="mt-2 font-display text-2xl">Good information should leave you feeling more capable.</h3></div><button data-testid={`button-${type}-listen`} className="inline-flex items-center gap-2 rounded-lg bg-[#e8f0ea] px-4 py-2.5 text-xs font-bold text-[#397269] hover:bg-[#dcebe0]"><Play size={15} /> Listen · 04:12</button></div></section></div>; }
function Guide({ title, icon: Icon }: { title: string; icon: IconType }) { return <button data-testid={`button-guide-${title.toLowerCase().replaceAll(' ', '-')}`} className="rounded-xl border border-[#e4e8df] p-4 text-left hover:border-[#9fbdb0]"><Icon size={18} className="text-[#397269]" /><p className="mt-5 text-sm font-semibold leading-5 text-[#52736f]">{title}</p><ArrowRight size={14} className="mt-3 text-[#8aa09a]" /></button>; }

function Progress() {
  const [range, setRange] = useState('30 days');
  return <div className="page-enter"><SectionTitle eyebrow="The bigger picture" title="Progress you can feel." description="Not a score. Just a kinder way to notice what is shifting over time." action={<div className="flex rounded-lg bg-[#e8eee8] p-1">{['7 days', '30 days', '3 months'].map((item) => <button key={item} onClick={() => setRange(item)} data-testid={`button-progress-range-${item.replace(' ', '-')}`} className={`rounded-md px-3 py-2 text-xs font-semibold ${range === item ? 'bg-[#fbf8f0] text-[#1e6364] shadow-sm' : 'text-[#71908b]'}`}>{item}</button>)}</div>} /><div className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]"><section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Wellbeing overview</p><h3 className="mt-2 font-display text-2xl">{range} of check-ins</h3></div><button aria-label="More progress options" data-testid="button-progress-options" className="rounded-lg p-2 text-[#71908b] hover:bg-[#edf0e8]"><MoreHorizontal size={18} /></button></div><div className="mt-9 flex h-48 items-end gap-2 border-b border-[#dfe5db] px-1">{[42,58,47,66,62,72,60,81,74,88,70,94,82,86,91,79,98,87].map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={`w-full rounded-t-md ${index > 13 ? 'bg-[#1e6364]' : 'bg-[#b8d4c5]'}`} style={{ height: `${height}%` }} /><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-[#173b3d] px-1.5 py-1 text-[9px] text-white group-hover:block">{Math.round(height / 10)}/10</span></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-[#8aa09a]"><span>Jun 01</span><span>Jun 18</span></div><div className="mt-7 flex flex-wrap gap-5 text-xs text-[#71908b]"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#1e6364]" /> Your energy</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#b8d4c5]" /> Earlier check-ins</span></div></section><section className="rounded-2xl bg-[#e4e1eb] p-6 md:p-8"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#686381]">A pattern to notice</p><h3 className="mt-3 font-display text-3xl leading-tight text-[#34354e]">You feel more steady after movement.</h3><p className="mt-5 text-sm leading-6 text-[#5c6077]">On 5 of your last 7 movement days, your evening energy check-in was higher.</p><div className="mt-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f1f6] text-[#615d7c]"><Zap size={18} /></span><p className="text-xs font-semibold text-[#4e526e]">Keep the experiment going</p></div></section></div><div className="mt-5 grid gap-5 sm:grid-cols-3"><ProgressMini title="Check-in rhythm" value="12 / 18" detail="days recorded" icon={ClipboardList} /><ProgressMini title="Movement" value="74 min" detail="this month" icon={Dumbbell} /><ProgressMini title="Sleep average" value="7h 12m" detail="past 7 days" icon={Moon} /></div></div>;
}
function ProgressMini({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: IconType }) { return <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-5 shadow-card"><Icon size={19} className="text-[#397269]" /><p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[#71908b]">{title}</p><p className="mt-2 font-display text-3xl">{value}</p><p className="mt-1 text-xs text-[#8aa09a]">{detail}</p></div>; }

function NotFound() { return <div className="grid min-h-[100dvh] place-items-center bg-[#f6f3ea] px-6 text-center text-[#173b3d]"><div><p className="text-sm font-bold text-[#71908b]">404</p><h1 className="mt-2 font-display text-5xl">This page wandered off.</h1><Link href="/" data-testid="link-not-found-home" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1e6364] px-4 py-3 text-sm font-semibold text-[#fbf8f0]">Return home <ArrowRight size={15} /></Link></div></div>; }

function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/auth" component={Auth} /><Route path="/onboarding" component={Onboarding} /><Route path="/dashboard"><Shell><Dashboard /></Shell></Route><Route path="/cycle"><Shell><Cycle /></Shell></Route><Route path="/nutrition"><Shell><Nutrition /></Shell></Route><Route path="/pcos"><Shell><PcosSupport /></Shell></Route><Route path="/menopause"><Shell><MenopauseSupport /></Shell></Route><Route path="/hygiene"><Shell><CarePage type="hygiene" /></Shell></Route><Route path="/fitness"><Shell><CarePage type="fitness" /></Shell></Route><Route path="/progress"><Shell><Progress /></Shell></Route><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;