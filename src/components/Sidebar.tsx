'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../app/styles/globals.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const menuItems = [
    { name: 'Resumen General', path: '/dashboard' },
    { name: 'Habilidades', path: '/habilities' },
  
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">RACEHORSE</div>
      
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
        
      </nav>

      <div 
          className="button-close"
          onClick={() => router.push('/')}
         
        >
          Cerrar Sesión
        </div>
    </aside>
  );
}