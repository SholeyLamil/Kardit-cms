import { useEffect, useState } from 'react'
import { MarketingFooter } from '../components/marketing/MarketingFooter'

const chamsswitchLogo = new URL('../assets/chamsswitch-logo.png', import.meta.url).href
const cbnLogo = new URL('../assets/cbn-logo.svg', import.meta.url).href
const unionpayLogo = new URL('../assets/unionpay-logo.svg', import.meta.url).href
const wemaLogo = new URL('../assets/wema-logo.svg', import.meta.url).href
const providusLogo = new URL('../assets/providus-logo.svg', import.meta.url).href

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    const revealEls = document.querySelectorAll('.reveal')
    let io: IntersectionObserver | null = null
    if (revealEls.length && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )
      revealEls.forEach((el) => io?.observe(el))
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'))
    }

    const parallaxCard = document.querySelector<HTMLDivElement>('[data-parallax="hero-card"]')
    let ticking = false
    const onParallaxScroll = () => {
      if (!ticking && parallaxCard && !reduceMotion) {
        ticking = true
        requestAnimationFrame(() => {
          const y = window.scrollY
          const offset = Math.max(-12, Math.min(12, y / 24)) * (y > 200 ? 0 : 1)
          parallaxCard.style.transform = `translateY(${offset.toFixed(1)}px)`
          ticking = false
        })
      }
    }
    if (parallaxCard && !reduceMotion) {
      window.addEventListener('scroll', onParallaxScroll, { passive: true })
    }

    const formatNumber = (n: number, opts?: { format?: string }) => {
      if (opts && opts.format === 'compact') {
        if (n >= 1000) {
          const k = n / 1000
          return (k >= 100 ? k.toFixed(0) : k.toFixed(k >= 10 ? 0 : 1)) + 'K'
        }
      }
      return Math.round(n).toLocaleString('en-US')
    }

    const counters = document.querySelectorAll<HTMLElement>('.stat__num[data-count]')
    let counterIO: IntersectionObserver | null = null
    if (counters.length && !reduceMotion) {
      counterIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement
              const target = parseInt(el.getAttribute('data-count') || '0', 10)
              const suffix = el.getAttribute('data-suffix') || ''
              const format = el.getAttribute('data-format') || ''
              const duration = 1600
              const start = performance.now()

              function tick(now: number) {
                const p = Math.min(1, (now - start) / duration)
                const eased = 1 - Math.pow(1 - p, 3)
                const current = Math.round(eased * target)
                el.textContent = formatNumber(current, { format }) + suffix
                if (p < 1) requestAnimationFrame(tick)
              }
              requestAnimationFrame(tick)
              counterIO?.unobserve(el)
            }
          })
        },
        { threshold: 0.3 }
      )
      counters.forEach((el) => counterIO?.observe(el))
    } else {
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute('data-count') || '0', 10)
        const suffix = el.getAttribute('data-suffix') || ''
        const format = el.getAttribute('data-format') || ''
        el.textContent = formatNumber(target, { format }) + suffix
      })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', onParallaxScroll)
      if (io) io.disconnect()
      if (counterIO) counterIO.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        :root {
          --cs-green-900: #0F4F2E;
          --cs-green-700: #1B7A45;
          --cs-green-500: #2BA15D;
          --cs-green-300: #BFE5CE;
          --cs-green-100: #E8F6EE;
          --cs-red-900: #9A1A1A;
          --cs-red-700: #C8242C;
          --cs-red-500: #E63946;
          --cs-white: #FFFFFF;
          --cs-paper: #FAFBF9;
          --cs-mist: #F2F4F1;
          --cs-line: #E4E7E2;
          --cs-line-strong: #C9CEC4;
          --cs-ink-100: #8C9189;
          --cs-ink-200: #5C6359;
          --cs-ink-400: #2F3530;
          --cs-ink-700: #161A17;
          --cs-ink-900: #0A0C0A;
          --cs-fg: var(--cs-ink-700);
          --cs-fg-muted: var(--cs-ink-200);
          --cs-bg: var(--cs-paper);
          --cs-primary: var(--cs-green-700);
          --cs-accent: var(--cs-red-700);
          --cs-shadow-sm: 0 2px 6px rgba(15,30,18,0.06), 0 1px 2px rgba(15,30,18,0.04);
          --cs-shadow-md: 0 6px 18px rgba(15,30,18,0.08), 0 2px 4px rgba(15,30,18,0.05);
          --cs-shadow-lg: 0 18px 48px rgba(15,30,18,0.12), 0 4px 12px rgba(15,30,18,0.06);
          --cs-font-display: "Plus Jakarta Sans", system-ui, sans-serif;
          --cs-font-body: "Lato", system-ui, -apple-system, "Segoe UI", sans-serif;
          --cs-font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: var(--cs-font-body);
          color: var(--cs-fg);
          background: var(--cs-bg);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }
        img { max-width: 100%; display: block; }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
        @media (max-width: 720px) { .container { padding: 0 24px; } }

        .site-header {
          position: sticky; top: 0; z-index: 60;
          height: 72px;
          background: rgba(255,255,255,0.65);
          border-bottom: 1px solid transparent;
          transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .site-header.is-scrolled {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom-color: var(--cs-line);
          box-shadow: 0 1px 0 rgba(15,30,18,0.02);
        }
        .site-header__inner {
          max-width: 1200px; margin: 0 auto; height: 100%;
          display: flex; align-items: center; gap: 28px; padding: 0 32px;
        }
        .logo-mark {
          font-family: var(--cs-font-display);
          font-weight: 800; font-size: 26px; line-height: 1;
          letter-spacing: -0.02em;
          color: var(--cs-green-900);
          display: inline-flex; align-items: baseline;
          user-select: none;
        }
        .logo-mark__i { position: relative; display: inline-block; }
        .logo-mark__i::after {
          content: "";
          position: absolute; top: -0.18em; left: 50%;
          width: 0.22em; height: 0.22em; border-radius: 50%;
          background: var(--cs-red-700);
          transform: translate(-50%, 0);
          transition: transform 220ms cubic-bezier(.34,1.56,.64,1);
        }
        .site-header__inner:hover .logo-mark__i::after { transform: translate(-50%, -3px); }
        .site-header__nav { display: flex; gap: 4px; flex: 1; margin-left: 32px; }
        .site-header__nav a {
          position: relative;
          font-weight: 600; font-size: 14px; color: var(--cs-ink-700);
          padding: 10px 14px; border-radius: 8px;
          transition: color 150ms ease;
        }
        .site-header__nav a:hover { color: var(--cs-green-700); }
        .site-header__cta { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .site-header__cta a.signin { padding: 10px 14px; font-size: 14px; font-weight: 600; color: var(--cs-ink-700); white-space: nowrap; }
        .site-header__cta a.signin:hover { color: var(--cs-green-700); }
        .btn-mobile { display: none; background: none; border: none; cursor: pointer; padding: 8px; width: 36px; height: 36px; flex-direction: column; justify-content: center; gap: 4px; }
        .btn-mobile span { display: block; height: 2px; background: var(--cs-ink-700); border-radius: 1px; }
        .mobile-menu { display: none !important; }

        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--cs-font-body); font-weight: 700; font-size: 15px;
          padding: 14px 22px;
          border-radius: 10px; border: 1.5px solid transparent;
          cursor: pointer; text-decoration: none;
          transition: background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 100ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .btn:active { transform: scale(0.98); box-shadow: var(--cs-shadow-sm); }
        .btn--primary { background: var(--cs-green-700); color: #fff; box-shadow: 0 2px 6px rgba(15,30,18,0.10); }
        .btn--primary:hover { background: var(--cs-green-900); }
        .btn--accent { background: var(--cs-red-700); color: #fff; box-shadow: 0 2px 6px rgba(200,36,44,0.20); }
        .btn--accent:hover { background: var(--cs-red-900); }
        .btn--ghost { background: #fff; color: var(--cs-ink-700); border-color: var(--cs-line-strong); }
        .btn--ghost:hover { border-color: var(--cs-ink-700); }

        .eyebrow {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--cs-green-700);
        }
        .eyebrow--inverse { color: var(--cs-green-300); }

        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          background: var(--cs-green-100); color: var(--cs-green-900);
          border: 1px solid var(--cs-green-300);
        }
        .pill .dot { width: 6px; height: 6px; background: var(--cs-green-500); border-radius: 50%; }

        .hero { position: relative; overflow: hidden; padding: 88px 0 48px; }
        .hero__bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero__bg svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .hero__inner { position: relative; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; z-index: 1; }
        .hero__title {
          font-family: var(--cs-font-display); font-weight: 800;
          font-size: clamp(40px, 6.4vw, 72px);
          line-height: 1.04; letter-spacing: -0.025em;
          color: var(--cs-ink-900);
          margin: 20px 0 0;
        }
        .hero__title em { font-style: normal; color: var(--cs-green-700); }
        .hero__title-line { display: block; opacity: 0; transform: translateY(18px); animation: hero-rise 700ms cubic-bezier(.2,.7,.2,1) forwards; }
        .hero__title-line:nth-of-type(2) { animation-delay: 90ms; }
        .hero__title-line:nth-of-type(3) { animation-delay: 180ms; }
        @keyframes hero-rise { to { opacity: 1; transform: translateY(0); } }
        .hero__lede {
          font-size: 18px; line-height: 1.6; color: var(--cs-ink-200);
          margin: 20px 0 0; max-width: 520px;
        }
        .hero__cta { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
        .hero__trust { margin-top: 28px; font-size: 13px; color: var(--cs-ink-100); }

        .hero__card {
          position: relative;
          background: #fff; border: 1px solid var(--cs-line); border-radius: 20px;
          padding: 24px;
          box-shadow: var(--cs-shadow-lg);
          will-change: transform;
        }
        .hero__card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .hero__card-label { font-size: 12px; color: var(--cs-ink-200); font-weight: 600; }
        .hero__card-amount {
          font-family: var(--cs-font-display); font-weight: 800; font-size: 36px;
          color: var(--cs-ink-900); font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
          margin-top: 4px;
        }
        .hero__card-delta {
          background: var(--cs-green-100); color: var(--cs-green-900);
          padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;
          border: 1px solid var(--cs-green-300);
          display: inline-flex; align-items: center; gap: 4px;
        }
        .hero__card-bars { display: flex; gap: 3px; height: 60px; align-items: flex-end; margin-top: 18px; }
        .hero__card-bars span {
          flex: 1; border-radius: 3px;
          background: var(--cs-green-300);
          transform-origin: bottom;
          animation: bar-rise 900ms cubic-bezier(.2,.7,.2,1) backwards;
        }
        .hero__card-bars span.is-recent { background: var(--cs-green-700); }
        @keyframes bar-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .hero__card-stats { margin-top: 20px; border-top: 1px solid var(--cs-line); padding-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .hero__card-stats .label { font-size: 11px; color: var(--cs-ink-100); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
        .hero__card-stats .value { font-family: var(--cs-font-display); font-weight: 700; font-size: 18px; color: var(--cs-ink-700); margin-top: 2px; font-variant-numeric: tabular-nums; }

        .trust-strip { background: #fff; border-top: 1px solid var(--cs-line); border-bottom: 1px solid var(--cs-line); }
        .trust-strip__inner { padding: 32px; display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .trust-strip__label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--cs-ink-100); white-space: nowrap; }
        .trust-strip__list { display: flex; gap: 24px; flex: 1; flex-wrap: wrap; align-items: center; justify-content: flex-end; }
        .trust-strip__list .mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 4px 8px;
          border-radius: 14px;
          background: #fff;
          box-shadow: inset 0 0 0 1px rgba(15, 30, 18, 0.06);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .trust-strip__list .mark:hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1px rgba(15, 30, 18, 0.12); }
        .trust-strip__list .mark-logo { display: block; height: 32px; width: auto; max-width: 160px; min-width: 48px; }
        .trust-strip__list .mark { min-width: 64px; }
        .trust-strip__list .mark-badge {
          width: 28px; height: 28px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--cs-green-700); color: #fff;
          font-size: 10px; font-weight: 900; margin-right: 6px; vertical-align: middle;
        }

        .section { padding: 96px 0; }
        .section--tight { padding: 64px 0; }
        .section--white { background: #fff; }
        .section--paper { background: var(--cs-paper); }
        .section--ink {
          background: var(--cs-green-900); color: #fff;
          position: relative; overflow: hidden;
        }
        .section--ink > .container { position: relative; z-index: 1; }
        .section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; gap: 32px; flex-wrap: wrap; }
        .section-head__title {
          font-family: var(--cs-font-display); font-weight: 800;
          font-size: clamp(28px, 3.6vw, 44px);
          letter-spacing: -0.02em; color: var(--cs-ink-900);
          margin: 8px 0 0; line-height: 1.1;
        }
        .section-head__lede { font-size: 16px; color: var(--cs-ink-200); max-width: 380px; line-height: 1.6; margin: 0; }
        .section--ink .section-head__title { color: #fff; }
        .section--ink .section-head__lede { color: var(--cs-green-300); max-width: 480px; }

        .card {
          background: #fff; border: 1px solid var(--cs-line); border-radius: 16px;
          padding: 28px;
          box-shadow: var(--cs-shadow-sm);
          transition: box-shadow 200ms ease, transform 200ms ease, border-color 200ms ease;
          display: flex; flex-direction: column; gap: 12px;
        }
        .card:hover { box-shadow: var(--cs-shadow-md); transform: translateY(-2px); border-color: var(--cs-line-strong); }
        .card__icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--cs-green-100); color: var(--cs-green-900);
          display: flex; align-items: center; justify-content: center;
          transition: background 200ms ease, color 200ms ease, transform 200ms ease;
        }
        .card:hover .card__icon { background: var(--cs-green-700); color: #fff; transform: rotate(-3deg) scale(1.04); }
        .card__name { font-family: var(--cs-font-display); font-weight: 700; font-size: 22px; color: var(--cs-ink-700); }
        .card__desc { font-size: 14px; color: var(--cs-ink-200); line-height: 1.6; margin: 0; flex: 1; }
        .btn-arrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-weight: 700; font-size: 14px; color: var(--cs-green-700);
          transition: gap 180ms ease;
        }
        .btn-arrow::after { content: "→"; transition: transform 180ms ease; }
        .btn-arrow:hover { gap: 10px; }
        .btn-arrow:hover::after { transform: translateX(2px); }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 24px; }
        .stats-grid .stat__num {
          font-family: var(--cs-font-display); font-weight: 800;
          font-size: clamp(40px, 5vw, 64px);
          letter-spacing: -0.025em; line-height: 1; color: #fff;
          font-variant-numeric: tabular-nums;
        }
        .stats-grid .stat__lab { margin-top: 10px; font-size: 14px; color: var(--cs-green-300); line-height: 1.5; }

        .infra-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .infra-card {
          border-radius: 16px;
          border: 1px solid var(--cs-line);
          background: #fff;
          box-shadow: var(--cs-shadow-sm);
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
        .infra-card.dark {
          background: var(--cs-green-900); color: #fff;
          border-color: var(--cs-green-900);
        }
        .infra-card h3 {
          font-family: var(--cs-font-display);
          font-size: 26px; line-height: 1.08;
          margin: 0 0 12px;
          font-weight: 800;
        }
        .infra-card p {
          color: var(--cs-ink-200);
          line-height: 1.6;
          margin: 0;
        }
        .infra-card.dark p { color: rgba(255,255,255,0.7); }
        .badge-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .badge {
          padding: 6px 12px; border-radius: 999px;
          background: var(--cs-green-100); color: var(--cs-green-900);
          font-size: 12px; font-weight: 700;
        }
        .infra-card.dark .badge { background: rgba(255,255,255,0.1); color: var(--cs-green-300); }

        .cta-band {
          background: #fff; border: 1px solid var(--cs-line); border-radius: 24px;
          padding: 56px 64px; box-shadow: var(--cs-shadow-md);
          display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: center;
          position: relative; overflow: hidden;
        }
        .cta-band__title {
          font-family: var(--cs-font-display); font-weight: 800;
          font-size: clamp(34px, 4vw, 48px); letter-spacing: -0.02em;
          color: var(--cs-ink-900); margin: 0; line-height: 1.1;
        }
        .cta-band__lede { font-size: 17px; color: var(--cs-ink-200); margin-top: 12px; max-width: 540px; line-height: 1.6; }
        .cta-band__actions { display: flex; flex-direction: column; gap: 10px; }

        .site-footer { background: var(--cs-ink-900); color: #fff; padding-top: 72px; }
        .site-footer__grid {
          max-width: 1200px; margin: 0 auto; padding: 0 32px 48px;
          display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 48px;
        }
        .site-footer__brand p { font-size: 14px; color: rgba(255,255,255,0.65); margin-top: 18px; line-height: 1.65; max-width: 320px; }
        .site-footer__brand .addr { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 16px; line-height: 1.6; }
        .site-footer__col h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--cs-green-300); margin: 0; }
        .site-footer__col ul { list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 10px; }
        .site-footer__col a { color: rgba(255,255,255,0.78); font-size: 14px; transition: color 150ms ease; }
        .site-footer__col a:hover { color: #fff; }
        .site-footer__rule { border-top: 1px solid rgba(255,255,255,0.12); }
        .site-footer__rule .row {
          max-width: 1200px; margin: 0 auto; padding: 24px 32px;
          display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap;
        }
        .site-footer__rule .copy { font-size: 12px; color: rgba(255,255,255,0.5); }
        .site-footer__badges { display: flex; gap: 8px; }
        .site-footer__badges span { padding: 3px 9px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
        .site-footer__badges .b1 { background: var(--cs-green-700); color: #fff; }
        .site-footer__badges .b2, .site-footer__badges .b3 { background: rgba(255,255,255,0.1); color: #fff; }

        .reveal { opacity: 0; transform: translateY(18px); transition: opacity 600ms cubic-bezier(.2,.7,.2,1), transform 600ms cubic-bezier(.2,.7,.2,1); will-change: opacity, transform; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal[data-delay="1"].is-visible { transition-delay: 80ms; }
        .reveal[data-delay="2"].is-visible { transition-delay: 160ms; }
        .reveal[data-delay="3"].is-visible { transition-delay: 240ms; }
        .reveal[data-delay="4"].is-visible { transition-delay: 320ms; }

        .problem-grid { display: grid; grid-template-columns: 0.92fr 1.08fr; gap: 70px; align-items: start; }
        .flow-panel {
          position: relative; min-height: 410px;
          border-radius: 16px; border: 1px solid var(--cs-line);
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.76)), #fff;
          box-shadow: var(--cs-shadow-md);
          padding: 28px; overflow: hidden;
        }
        .flow-line { position: absolute; left: 54px; top: 60px; bottom: 60px; width: 2px; background: var(--cs-line); }
        .flow-step { position: relative; display: grid; grid-template-columns: 54px 1fr; gap: 16px; align-items: start; margin-bottom: 26px; z-index: 1; }
        .flow-dot {
          width: 32px; height: 32px; border-radius: 50%;
          display: grid; place-items: center;
          background: #fff; border: 1px solid var(--cs-green-300);
          color: var(--cs-green-700); font-size: 12px; font-weight: 900;
          box-shadow: 0 4px 12px rgba(15,30,18,0.06);
        }
        .flow-step h3 { margin: 2px 0 6px; font-size: 17px; font-family: var(--cs-font-display); font-weight: 700; }
        .flow-step p { color: var(--cs-ink-200); line-height: 1.5; font-size: 14px; margin: 0; }

        .platform-layout { display: grid; grid-template-columns: 0.92fr 1.08fr; gap: 56px; align-items: center; }
        .capability-list { display: grid; gap: 12px; margin-top: 34px; }
        .capability {
          display: grid; grid-template-columns: 44px 1fr; gap: 14px; align-items: start;
          padding: 20px; border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .cap-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--cs-green-100); display: grid; place-items: center;
          color: var(--cs-green-700); font-weight: 900; font-size: 13px;
        }
        .capability h3 { margin: 0 0 5px; font-size: 17px; font-family: var(--cs-font-display); font-weight: 700; color: #fff; }
        .capability p { color: rgba(255,255,255,0.6); line-height: 1.5; margin: 0; font-size: 14px; }

        .platform-shell { min-height: 510px; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; background: rgba(255,255,255,0.055); box-shadow: 0 28px 70px rgba(0,0,0,0.18); padding: 20px; }
        .mock-window { height: 100%; min-height: 470px; border-radius: 12px; background: #f8fbf8; color: var(--cs-ink-700); overflow: hidden; }
        .mock-top { height: 54px; border-bottom: 1px solid #e1e8e3; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; }
        .mock-title { font-size: 13px; font-weight: 900; color: var(--cs-green-900); }
        .mock-pill { padding: 4px 10px; border-radius: 999px; background: var(--cs-green-100); color: var(--cs-green-700); font-size: 11px; font-weight: 900; }
        .mock-content { padding: 20px; }
        .mock-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
        .metric { border: 1px solid #e0e9e3; border-radius: 8px; padding: 14px; background: #fff; }
        .metric span { color: var(--cs-ink-100); display: block; font-size: 11px; font-weight: 800; margin-bottom: 8px; }
        .metric strong { display: block; font-size: 22px; line-height: 1; font-family: var(--cs-font-display); font-weight: 800; color: var(--cs-ink-900); font-variant-numeric: tabular-nums; }
        .mock-table { border: 1px solid #e0e9e3; border-radius: 8px; background: #fff; overflow: hidden; }
        .mock-row { min-height: 54px; display: grid; grid-template-columns: 1.1fr 0.8fr 0.8fr 0.7fr; gap: 12px; align-items: center; padding: 0 16px; border-bottom: 1px solid #eef3ef; font-size: 12px; }
        .mock-row:last-child { border-bottom: 0; }
        .mock-row strong { font-size: 13px; font-family: var(--cs-font-display); font-weight: 700; }
        .status { justify-self: start; padding: 4px 10px; border-radius: 999px; background: var(--cs-green-100); color: var(--cs-green-700); font-size: 11px; font-weight: 900; }

        .security-layout { display: grid; grid-template-columns: 0.92fr 1.08fr; gap: 64px; align-items: start; }
        .security-stack { display: grid; gap: 12px; }
        .security-item { border: 1px solid var(--cs-line); border-radius: 12px; background: #fff; padding: 20px; display: grid; grid-template-columns: 34px 1fr; gap: 14px; align-items: start; }
        .security-index { width: 30px; height: 30px; border-radius: 8px; background: var(--cs-green-100); color: var(--cs-green-700); display: grid; place-items: center; font-size: 12px; font-weight: 900; }
        .security-item h3 { margin: 0 0 4px; font-size: 16px; font-family: var(--cs-font-display); font-weight: 700; }
        .security-item p { color: var(--cs-ink-200); line-height: 1.5; margin: 0; font-size: 14px; }

        .audience-panel { border: 1px solid var(--cs-line); border-radius: 16px; background: #fff; box-shadow: var(--cs-shadow-md); padding: 32px; }
        .audience-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; margin-bottom: 24px; }
        .audience-header h2 { max-width: 650px; font-size: 36px; line-height: 1.05; margin: 0; font-family: var(--cs-font-display); font-weight: 800; letter-spacing: -0.02em; color: var(--cs-ink-900); }
        .audience-header p { max-width: 390px; color: var(--cs-ink-200); line-height: 1.55; margin: 0; font-size: 15px; }
        .audience-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .audience { border-radius: 12px; background: var(--cs-paper); padding: 20px; }
        .audience span { color: var(--cs-green-700); font-size: 12px; font-weight: 900; }
        .audience h3 { margin: 16px 0 8px; font-size: 18px; font-family: var(--cs-font-display); font-weight: 700; color: var(--cs-ink-900); }
        .audience p { color: var(--cs-ink-200); line-height: 1.5; margin: 0; font-size: 14px; }

        .final-band { background: var(--cs-green-900); color: #fff; position: relative; overflow: hidden; padding: 96px 0; }
        .final-band .container { display: grid; grid-template-columns: 1fr auto; gap: 34px; align-items: center; position: relative; z-index: 1; }
        .final-band h2 { max-width: 650px; font-size: 44px; line-height: 1.02; margin: 0 0 16px; font-family: var(--cs-font-display); font-weight: 800; letter-spacing: -0.02em; }
        .final-band p { max-width: 640px; color: rgba(255,255,255,0.6); font-size: 17px; line-height: 1.6; margin: 0; }
        .final-actions { display: flex; gap: 10px; }

        @media (max-width: 1100px) {
          .hero__inner, .platform-layout, .security-layout { grid-template-columns: 1fr; gap: 40px; }
          .problem-grid { grid-template-columns: 1fr; gap: 40px; }
          .final-band .container { grid-template-columns: 1fr; }
        }
        @media (max-width: 980px) {
          .site-header__nav { display: none; }
          .btn-mobile { display: flex; }
          .hero__card-amount { font-size: 28px; }
          .infra-cards { grid-template-columns: 1fr; }
          .audience-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .site-footer__grid { grid-template-columns: 1fr 1fr; }
          .cta-band { grid-template-columns: 1fr; padding: 40px 28px; }
          .audience-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 640px) {
          .hero { padding: 56px 0 32px; }
          .hero__inner { gap: 32px; }
          .section { padding: 64px 0; }
          .audience-grid { grid-template-columns: 1fr; }
          .mobile-menu { display: none !important; flex-direction: column; gap: 4px; padding: 16px 24px 24px; background: #fff; border-bottom: 1px solid var(--cs-line); box-shadow: 0 8px 24px rgba(15,30,18,0.06); }
          .mobile-menu.is-open { display: flex !important; }
          .mobile-menu a { padding: 10px 4px; text-decoration: none; color: var(--cs-ink-700); font-size: 15px; font-weight: 600; }
          .mobile-menu a:hover { color: var(--cs-green-700); }
          .site-footer__grid { grid-template-columns: 1fr; gap: 32px; }
          .cta-band { padding: 32px 24px; }
          .cta-band__actions .btn { width: 100%; justify-content: center; }
        }
        @media (max-width: 540px) {
          .site-header__cta a.signin { padding: 8px 8px; font-size: 13px; }
          .site-header__cta .btn { padding: 10px 14px; font-size: 13px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
          .hero__title-line { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} role="banner">
        <div className="site-header__inner">
          <a href="/" className="site-header__logo" aria-label="Kardit home">
            <span className="logo-mark">
              Kard<span className="logo-mark__i">i</span>t
            </span>
          </a>
          <div className="site-header__cta">
            <a className="signin" href="/signin">
              Sign in
            </a>
            <a className="btn btn--accent btn--small" href="/onboarding">
              Start enrollment
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" data-swoosh>
          <div className="hero__bg" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="thickGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#C8242C" stopOpacity="0" />
                  <stop offset="0.25" stopColor="#C8242C" stopOpacity="0.35" />
                  <stop offset="0.55" stopColor="#C8242C" stopOpacity="0.50" />
                  <stop offset="1" stopColor="#E63946" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="thinGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#E63946" stopOpacity="0" />
                  <stop offset="0.45" stopColor="#E63946" stopOpacity="0.30" />
                  <stop offset="0.85" stopColor="#E63946" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M-40 420 C 160 350, 280 180, 480 200 C 640 216, 740 80, 920 100 C 1040 114, 1140 200, 1240 190"
                fill="none"
                stroke="url(#thickGrad)"
                strokeWidth="32"
                strokeLinecap="round"
              />
              <path
                d="M-40 460 C 160 390, 290 240, 470 240 C 610 240, 740 175, 900 190 C 1050 204, 1160 260, 1240 240"
                fill="none"
                stroke="url(#thinGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="container hero__inner">
            <div>
              <span className="pill">
                <span className="dot"></span> UnionPay TPSP · CBN regulated
              </span>
              <h1 className="hero__title">
                <span className="hero__title-line">Pay Your Chinese Suppliers</span>
                <span className="hero__title-line">
                  <em>Without the Friction.</em>
                </span>
              </h1>
              <p className="hero__lede">
                Kardit gives African businesses a regulated path to manage supplier payments,
                corporate card instruments, bank approvals, and trade operations across Asia-facing
                corridors.
              </p>
              <div className="hero__cta">
                <a className="btn btn--primary" href="/onboarding">
                  Start enrollment
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 5v14m0 0 6-6m-6 6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a className="btn btn--ghost" href="/contact">
                  Talk to a partner manager
                </a>
              </div>
              <div className="hero__trust">
                Built by ChamsSwitch · CBN-licensed switching · UnionPay International
                TPSP
              </div>
            </div>

          </div>
        </section>

        <div id="trust" className="trust-strip">
          <div className="container trust-strip__inner reveal">
            <div className="trust-strip__label">Regulated by</div>
            <div className="trust-strip__list">
              <div className="mark">
                <img className="mark-logo" src={chamsswitchLogo} alt="ChamsSwitch" />
              </div>
              <div className="mark">
                <img className="mark-logo" src={cbnLogo} alt="Central Bank of Nigeria" />
              </div>
              <div className="mark">
                <img className="mark-logo" src={unionpayLogo} alt="UnionPay International" />
              </div>
              <div className="mark">
                <img className="mark-logo" src={wemaLogo} alt="Wema Bank" />
              </div>
              <div className="mark">
                <img className="mark-logo" src={providusLogo} alt="Providus Bank" />
              </div>
            </div>
          </div>
        </div>

        <section className="section section--white">
          <div className="container problem-grid">
            <div className="reveal">
              <p className="eyebrow">The Trade Problem</p>
              <h2 className="section-head__title" style={{ marginTop: '8px' }}>
                Trade payments are still trapped in paperwork and portals.
              </h2>
              <p className="section-head__lede" style={{ maxWidth: '480px', marginTop: '12px' }}>
                Importers coordinate banks, invoices, regulatory documentation, FX workflows, payment
                execution, supplier reconciliation, and card operations across disconnected systems.
                Kardit brings those steps into governed software.
              </p>
            </div>

            <div className="flow-panel reveal" data-delay="1" aria-label="Fragmented trade workflow">
              <div className="flow-line" aria-hidden="true"></div>
              <div className="flow-step">
                <div className="flow-dot">01</div>
                <div>
                  <h3>Supplier payment request</h3>
                  <p>Business initiates payment activity and links supporting trade context.</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="flow-dot">02</div>
                <div>
                  <h3>KYB, KYC, and bank scope</h3>
                  <p>Entities, users, cards, and partner banks are checked before operations proceed.</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="flow-dot">03</div>
                <div>
                  <h3>Payment instrument and execution</h3>
                  <p>Approved workflows move through UnionPay-enabled card and payment infrastructure.</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="flow-dot">04</div>
                <div>
                  <h3>Visibility, reporting, audit trail</h3>
                  <p>Transactions, approvals, CMS outcomes, and operational events remain traceable.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="section--ink">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: 0.3,
            }}
            viewBox="0 0 1440 720"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M-100 590 C 160 475, 260 230, 530 280 C 720 315, 870 160, 1080 180 C 1240 196, 1290 290, 1530 244"
              fill="none"
              stroke="#2BA15D"
              strokeWidth="76"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M-120 660 C 150 510, 250 350, 520 370 C 720 385, 840 300, 1030 330 C 1240 362, 1320 420, 1530 360"
              fill="none"
              stroke="#2BA15D"
              strokeWidth="30"
              strokeLinecap="round"
              opacity="0.12"
            />
          </svg>
          <div className="container" style={{ padding: '96px 32px' }}>
            <div className="platform-layout">
              <div className="reveal">
                <p className="eyebrow eyebrow--inverse">The Kardit Platform</p>
                <h2 className="section-head__title" style={{ color: '#fff', marginTop: '8px' }}>
                  One operating layer for Asia-facing trade payments.
                </h2>
                <p
                  className="section-head__lede"
                  style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '480px', marginTop: '12px' }}
                >
                  Kardit connects onboarding, supplier payments, UnionPay-enabled corporate card
                  instruments, bank oversight, transaction visibility, and auditability into a single
                  infrastructure-grade experience.
                </p>

                <div className="capability-list">
                  <div className="capability">
                    <div className="cap-icon">01</div>
                    <div>
                      <h3>Pay suppliers and manage instruments</h3>
                      <p>Support payment execution and China UnionPay-enabled corporate card programs.</p>
                    </div>
                  </div>
                  <div className="capability">
                    <div className="cap-icon">02</div>
                    <div>
                      <h3>Coordinate banks and affiliates</h3>
                      <p>Let issuing banks approve, monitor, suspend, and govern activity by scope.</p>
                    </div>
                  </div>
                  <div className="capability">
                    <div className="cap-icon">03</div>
                    <div>
                      <h3>See the whole operational trail</h3>
                      <p>Keep KYB, card lifecycle, funding, transactions, reports, and audit events visible.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="platform-shell reveal" data-delay="1">
                <div className="mock-window">
                  <div className="mock-top">
                    <div className="mock-title">Trade Operations</div>
                    <div className="mock-pill">Bank-scoped</div>
                  </div>
                  <div className="mock-content">
                    <div className="mock-metrics">
                      <div className="metric">
                        <span>Active cards</span>
                        <strong>18.4k</strong>
                      </div>
                      <div className="metric">
                        <span>Funding volume</span>
                        <strong>₦2.8b</strong>
                      </div>
                      <div className="metric">
                        <span>Pending reviews</span>
                        <strong>24</strong>
                      </div>
                    </div>
                    <div className="mock-table">
                      <div className="mock-row">
                        <strong>Acme Imports</strong>
                        <span>China supplier</span>
                        <span>₦38.5m</span>
                        <span className="status">Approved</span>
                      </div>
                      <div className="mock-row">
                        <strong>Riverside Trade</strong>
                        <span>KYB review</span>
                        <span>4 docs</span>
                        <span className="status">Pending</span>
                      </div>
                      <div className="mock-row">
                        <strong>Wema Portfolio</strong>
                        <span>Cards issued</span>
                        <span>7,420</span>
                        <span className="status">Live</span>
                      </div>
                      <div className="mock-row">
                        <strong>Providus Scope</strong>
                        <span>Audit trail</span>
                        <span>Synced</span>
                        <span className="status">Clear</span>
                      </div>
                      <div className="mock-row">
                        <strong>UnionPay Program</strong>
                        <span>CMS status</span>
                        <span>99.9%</span>
                        <span className="status">Healthy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section--ink" style={{ background: 'var(--cs-green-900)' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: 0.12,
            }}
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M-40 420 C 160 350, 280 180, 480 200 C 640 216, 740 80, 920 100 C 1040 114, 1140 200, 1240 190"
              fill="none"
              stroke="#2BA15D"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <path
              d="M-40 460 C 160 390, 290 240, 470 240 C 610 240, 740 175, 900 190 C 1050 204, 1160 260, 1240 240"
              fill="none"
              stroke="#2BA15D"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </svg>
          <div className="container" style={{ padding: '96px 32px', position: 'relative', zIndex: 1 }}>
            <div className="section-head reveal">
              <div>
                <p className="eyebrow eyebrow--inverse">By the numbers</p>
                <h2 className="section-head__title" style={{ color: '#fff' }}>
                  A platform with proof.
                </h2>
              </div>
            </div>
            <div className="stats-grid">
              <div className="reveal" data-delay="1">
                <div className="stat__num" data-count="200000" data-suffix="+" data-format="compact">
                  0
                </div>
                <div className="stat__lab">businesses on the platform</div>
              </div>
              <div className="reveal" data-delay="2">
                <div className="stat__num" data-count="6" data-suffix="+">
                  0
                </div>
                <div className="stat__lab">global card schemes connected</div>
              </div>
              <div className="reveal" data-delay="3">
                <div className="stat__num" data-count="16" data-suffix="+">
                  0
                </div>
                <div className="stat__lab">years of payments experience</div>
              </div>
              <div className="reveal" data-delay="4">
                <div className="stat__num">24/7</div>
                <div className="stat__lab">real-time monitoring & support</div>
              </div>
            </div>
          </div>
        </section>

        <section id="partners" className="section section--white">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <p className="eyebrow">Infrastructure Advantage</p>
                <h2 className="section-head__title">Built on regulated switching and UnionPay rails.</h2>
              </div>
              <p className="section-head__lede">
                Kardit commercializes ChamsSwitch's regulated infrastructure and UnionPay licensing into a
                platform for businesses, banks, and partners across Africa-Asia trade corridors.
              </p>
            </div>

            <div className="infra-cards">
              <article className="infra-card reveal" data-delay="1">
                <div>
                  <h3>ChamsSwitch payment infrastructure</h3>
                  <p>
                    Built by a CBN-licensed switching and payment solutions provider, Kardit supports
                    governed trade payment workflows with institutional oversight.
                  </p>
                </div>
                <div className="badge-row">
                  <span className="badge">CBN licensed</span>
                  <span className="badge">Switching infrastructure</span>
                  <span className="badge">Payment solutions</span>
                </div>
              </article>
              <article className="infra-card dark reveal" data-delay="2">
                <div>
                  <h3>UnionPay International TPSP licensing</h3>
                  <p>
                    Kardit supports China UnionPay Card issuance through approved issuing bank
                    partnerships and controlled program operations.
                  </p>
                </div>
                <div className="badge-row">
                  <span className="badge">UnionPay TPSP</span>
                  <span className="badge">Issuing bank partners</span>
                  <span className="badge">China corridor ready</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="security" className="section section--paper">
          <div className="container security-layout">
            <div className="reveal">
              <p className="eyebrow">Security & Compliance</p>
              <h2 className="section-head__title" style={{ marginTop: '8px' }}>
                Trust is designed into the operating model.
              </h2>
              <p className="section-head__lede" style={{ maxWidth: '480px', marginTop: '12px' }}>
                Kardit is built for sensitive trade and payment operations, where access, identity,
                approval, and auditability matter as much as the payment itself.
              </p>
            </div>
            <div className="security-stack reveal" data-delay="1">
              <div className="security-item">
                <div className="security-index">01</div>
                <div>
                  <h3>IAM and role-based access</h3>
                  <p>
                    Central identity, user roles, tenant scope, bank scope, and service-provider
                    oversight.
                  </p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-index">02</div>
                <div>
                  <h3>KYB, KYC, and compliance review</h3>
                  <p>
                    Business activation and card/customer workflows are supported by required identity
                    checks.
                  </p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-index">03</div>
                <div>
                  <h3>Maker-checker and audit logs</h3>
                  <p>
                    Financial operations, approvals, CMS responses, and lifecycle events remain traceable.
                  </p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-index">04</div>
                <div>
                  <h3>Protected card and transaction data</h3>
                  <p>
                    Operational records use masked card details and controlled access to sensitive
                    information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--white">
          <div className="container">
            <div className="audience-panel reveal">
              <div className="audience-header">
                <h2>Built for every institution in the trade payment chain.</h2>
                <p>
                  Kardit aligns businesses, affiliates, banks, and infrastructure partners around a
                  governed operating model.
                </p>
              </div>
              <div className="audience-grid">
                <div className="audience">
                  <span>01</span>
                  <h3>Importers</h3>
                  <p>Pay suppliers and reduce manual trade-payment friction.</p>
                </div>
                <div className="audience">
                  <span>02</span>
                  <h3>Affiliates</h3>
                  <p>Operate customer, card, funding, and reporting workflows.</p>
                </div>
                <div className="audience">
                  <span>03</span>
                  <h3>Issuing banks</h3>
                  <p>Approve partnerships and supervise bank-scoped portfolios.</p>
                </div>
                <div className="audience">
                  <span>04</span>
                  <h3>Platform partners</h3>
                  <p>Connect to infrastructure for Asia-facing commerce use cases.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ padding: '48px 0 96px' }}>
          <div className="container reveal">
            <div className="cta-band">
              <div>
                <h2 className="cta-band__title">Ready to modernize your trade payments?</h2>
                <p className="cta-band__lede">
                  Start with supplier payments to China, then grow into a governed trade payment
                  operating layer for cards, documentation, approvals, reporting, and oversight.
                </p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn--accent" href="/onboarding">
                  Start enrollment
                </a>
                <a className="btn btn--ghost" href="/contact">
                  Talk to Kardit
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />


      </>
  )
}
