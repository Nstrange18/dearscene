import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
export function Wordmark() { return <span className="wordmark"><span className="brand-spark" aria-hidden="true"><i/><i/><i/><i/></span>dearscene.</span>; }
export function Layout() {
  const [open, setOpen] = useState(false); const location = useLocation();
  useEffect(() => { setOpen(false); const frame = requestAnimationFrame(() => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }); return () => cancelAnimationFrame(frame); }, [location.pathname, location.hash]);
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><div className="container nav-inner"><Link to="/" aria-label="DearScene home"><Wordmark/></Link><button className="icon-button mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button><nav id="site-nav" className={open ? 'nav-open' : ''}><NavLink to="/templates">Explore templates</NavLink><Link to="/#how-it-works">How it works</Link><Link className="button button--fig" to="/templates">Tell your story <ArrowUpRight size={17}/></Link></nav></div></header><Outlet/><footer className="site-footer"><div className="container footer-inner"><Link to="/" aria-label="DearScene home"><Wordmark/></Link><p>Your moments. Beautifully told.</p><Link to="/templates">Find your first scene <ArrowUpRight size={16}/></Link></div></footer></>;
}
