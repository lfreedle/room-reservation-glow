
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-between px-6 md:px-12 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <Link 
        to="/"
        className="text-2xl font-medium tracking-tight transition-opacity hover:opacity-80"
      >
        GCA<span className="text-primary">CHURCH</span>
      </Link>
      
      <nav className="flex items-center gap-8">
        <NavLink to="/" current={location.pathname === "/"}>
          Home
        </NavLink>
        <NavLink to="/book" current={location.pathname.startsWith("/book")}>
          Book a Room
        </NavLink>
        <NavLink to="/admin" current={location.pathname.startsWith("/admin")}>
          Admin
        </NavLink>
      </nav>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, current, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative text-sm font-medium transition-colors hover:text-primary",
        current ? "text-primary" : "text-foreground/80",
        "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-left after:transition-transform",
        current ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
