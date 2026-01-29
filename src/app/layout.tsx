'use client';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";

import '../app/styles/login.css'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {isLoginPage ? (
        
          <div className="login-wrapper">
            {children}
          </div>
        ) : (
          <div className="dashboard-layout">
            <Sidebar /> 
            <main className="main-content">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}