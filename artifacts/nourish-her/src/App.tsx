import { type ButtonHTMLAttributes, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity, ArrowRight, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleHelp, ClipboardList, Droplets,
  Dumbbell, HeartPulse, Home as HomeIcon, Leaf, LineChart, Menu, Moon,
  MoreHorizontal, MoveRight, Play, Plus, Settings, ShieldCheck,
  Sparkles, SunMedium, Target, Utensils, X, Zap
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
  '/dashboard': 'Good morning',
  '/progress': 'Health & progress',
  '/cycle': 'Menstrual cycle',
  '/nutrition': 'Nutrition planner',
  '/pcos': 'PCOS / PCOD support',
  '/menopause': 'Menopause support',
  '/hygiene': 'Menstrual hygiene',
  '/fitness': 'Fitness & self-care',
};

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
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${styles[variant]} ${className}`} />;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentTitle = pageNames[location] || 'Nourish Her';
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
              <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Today</p><h1 className="mt-0.5 text-lg font-semibold tracking-[-.02em]">{currentTitle}</h1></div>
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

function Cycle() {
  const [tab, setTab] = useState('overview');
  const tabs = ['overview', 'symptoms', 'insights'];
  return <div className="page-enter"><SectionTitle eyebrow="Know your rhythm" title="Your cycle, with context." description="A clear view of where you are now, plus practical ways to support how you feel." action={<Button variant="outline" data-testid="button-cycle-log"><Plus size={16} /> Log symptoms</Button>} /><div className="mb-6 flex gap-1 border-b border-[#dfe5db]">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} data-testid={`button-cycle-tab-${item}`} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === item ? 'border-[#1e6364] text-[#1e6364]' : 'border-transparent text-[#8aa09a] hover:text-[#52736f]'}`}>{item}</button>)}</div>{tab === 'overview' ? <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card md:p-8"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Current cycle</p><h3 className="mt-2 font-display text-3xl">Day 14 of 30</h3></div><span className="rounded-full bg-[#e1efea] px-3 py-1.5 text-xs font-bold text-[#397269]">Follicular phase</span></div><div className="my-10 grid place-items-center"><div className="relative grid h-60 w-60 place-items-center rounded-full" style={{ background: 'conic-gradient(#d18b62 0 16.6%, #1e6364 16.6% 46.6%, #d8b275 46.6% 56.6%, #ccdcd2 56.6% 100%)' }}><div className="grid h-44 w-44 place-items-center rounded-full bg-[#fbf8f0] text-center"><span className="font-display text-6xl">14</span><span className="text-xs text-[#71908b]">Tuesday, 18 June</span></div></div></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[['Period', '1–5 Jun'], ['Ovulation', '15 Jun'], ['Next period', '1 Jul'], ['Cycle length', '30 days']].map(([a,b]) => <div key={a} className="rounded-xl bg-[#f0f3ec] p-3"><p className="text-[10px] uppercase tracking-wider text-[#8aa09a]">{a}</p><p className="mt-1 text-sm font-bold text-[#52736f]">{b}</p></div>)}</div></section><section className="space-y-5"><div className="rounded-2xl bg-[#e4e1eb] p-6"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#686381]">In this phase</p><h3 className="mt-2 font-display text-2xl text-[#34354e]">Build and explore.</h3><p className="mt-4 text-sm leading-6 text-[#5c6077]">Oestrogen is rising, and many people notice more energy, focus and social ease. Take what resonates — your experience is the useful data.</p><Link href="/fitness" data-testid="link-cycle-movement" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#4e526e]">See movement suggestions <ArrowRight size={13} /></Link></div><div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-6 shadow-card"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#71908b]">Recent check-ins</p><div className="mt-5 space-y-4"><CheckIn label="Energy" value="Good" /><CheckIn label="Mood" value="Steady" /><CheckIn label="Sleep" value="6h 48m" /></div></div></section></div> : <div className="rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#e1efea] text-[#397269]">{tab === 'symptoms' ? <ClipboardList size={22} /> : <LineChart size={22} />}</div><h3 className="mt-4 font-display text-2xl">{tab === 'symptoms' ? 'Your symptom notes' : 'Your cycle insights'}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71908b]">{tab === 'symptoms' ? 'No notes today. A quick check-in can help you notice patterns over time.' : 'Keep checking in for a little longer. Your first useful pattern is taking shape.'}</p><Button className="mt-6" data-testid={`button-cycle-${tab}-action`}><Plus size={15} /> {tab === 'symptoms' ? 'Add a check-in' : 'View monthly summary'}</Button></div>}</div>;
}
function CheckIn({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-[#e7ebe2] pb-3 text-sm"><span className="text-[#71908b]">{label}</span><span className="font-semibold text-[#52736f]">{value}</span></div>; }

function Nutrition() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Steady energy', 'Iron-rich', 'Quick'];
  const meals = [{ title: 'Herby lentil bowl', type: 'Steady energy', time: '25 min', desc: 'Warm lentils, roasted carrots, greens and lemon tahini.', tags: ['Protein', 'Fibre'] }, { title: 'Spinach & egg toast', type: 'Quick', time: '10 min', desc: 'Soft eggs, wilted spinach and sourdough with seeds.', tags: ['Iron-rich', 'Quick'] }, { title: 'Salmon sesame rice', type: 'Iron-rich', time: '30 min', desc: 'Miso salmon with cucumber, brown rice and edamame.', tags: ['Protein', 'Omega-3'] }];
  const shown = filter === 'All' ? meals : meals.filter((meal) => meal.type === filter || meal.tags.includes(filter));
  return <div className="page-enter"><SectionTitle eyebrow="Food that supports your day" title="What sounds good?" description="Flexible ideas for steadier energy, without turning eating into another task." action={<Button variant="outline" data-testid="button-nutrition-add"><Plus size={16} /> Add to plan</Button>} /><div className="mb-7 flex flex-wrap gap-2">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} data-testid={`button-nutrition-filter-${item.toLowerCase().replaceAll(' ', '-')}`} className={`rounded-full border px-4 py-2 text-xs font-semibold ${filter === item ? 'border-[#1e6364] bg-[#1e6364] text-[#fbf8f0]' : 'border-[#d7dfd7] bg-[#fbf8f0] text-[#71908b] hover:border-[#9fbdb0]'}`}>{item}</button>)}</div><div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]"><section className="rounded-2xl bg-[#1e6364] p-6 text-[#f7f2e8] md:p-8"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#a9ddc8]">Today’s anchors</p><h3 className="mt-2 font-display text-3xl">A little steadier.</h3></div><Utensils size={21} className="text-[#a9ddc8]" /></div><p className="mt-4 text-sm leading-6 text-[#c3d8ce]">Rather than perfect meals, aim for three things that help your body feel supported.</p><div className="mt-8 space-y-3"><Anchor title="Protein at breakfast" detail="Yoghurt, eggs, tofu or beans" done /><Anchor title="Colour on your plate" detail="Add one fruit or vegetable" /><Anchor title="A proper pause" detail="Eat away from your screen" /></div></section><section><div className="mb-4 flex items-center justify-between"><h3 className="font-display text-2xl">Ideas for you</h3><button data-testid="button-nutrition-refresh" className="text-xs font-bold text-[#397269] hover:underline">Refresh ideas</button></div><div className="space-y-3">{shown.map((meal) => <Meal key={meal.title} {...meal} />)}</div>{shown.length === 0 && <div className="rounded-2xl border border-dashed border-[#cfdacf] p-8 text-center text-sm text-[#71908b]">No ideas in this view yet.</div>}</section></div></div>;
}
function Anchor({ title, detail, done = false }: { title: string; detail: string; done?: boolean }) { return <div className="flex items-center gap-3 rounded-xl bg-[#2c7371] p-3.5"><span className={`grid h-8 w-8 place-items-center rounded-full ${done ? 'bg-[#9bd6c2] text-[#173b3d]' : 'border border-[#70a99a] text-[#a9ddc8]'}`}>{done ? <Check size={15} /> : <span className="text-xs"> </span>}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-[#b8d4c8]">{detail}</p></div></div>; }
function Meal({ title, type, time, desc, tags }: { title: string; type: string; time: string; desc: string; tags: string[] }) { return <button data-testid={`button-meal-${title.toLowerCase().replaceAll(' ', '-')}`} className="group flex w-full items-center justify-between rounded-2xl border border-[#dfe5db] bg-[#fbf8f0] p-4 text-left shadow-card hover:border-[#9fbdb0]"><div className="flex items-center gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#f2e4d2] text-[#a56744]"><Leaf size={21} /></div><div><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold text-[#356562]">{title}</h4><span className="text-[10px] font-bold uppercase tracking-wider text-[#9aaba3]">{type}</span></div><p className="mt-1 text-xs leading-5 text-[#78908a]">{desc}</p><div className="mt-2 flex gap-1.5">{tags.map((tag) => <span key={tag} className="rounded-full bg-[#edf5ee] px-2 py-0.5 text-[10px] font-semibold text-[#52736f]">{tag}</span>)}</div></div></div><ChevronRight size={17} className="shrink-0 text-[#8aa09a] transition-transform group-hover:translate-x-1" /></button>; }

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
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/auth" component={Auth} /><Route path="/onboarding" component={Onboarding} /><Route path="/dashboard"><Shell><Dashboard /></Shell></Route><Route path="/cycle"><Shell><Cycle /></Shell></Route><Route path="/nutrition"><Shell><Nutrition /></Shell></Route><Route path="/pcos"><Shell><CarePage type="pcos" /></Shell></Route><Route path="/menopause"><Shell><CarePage type="menopause" /></Shell></Route><Route path="/hygiene"><Shell><CarePage type="hygiene" /></Shell></Route><Route path="/fitness"><Shell><CarePage type="fitness" /></Shell></Route><Route path="/progress"><Shell><Progress /></Shell></Route><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;