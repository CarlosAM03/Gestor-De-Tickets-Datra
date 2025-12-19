import { Outlet } from 'react-router-dom';
import AppNavBar from '@/components/AppNavBar/AppNavBar';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="app-shell">
      <AppNavBar />

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
