import Sidebar from '../../components/Sidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const role = localStorage.getItem('role') as 'administrador' | 'cliente';

  useEffect(() => {
    // Verificar si no hay token en localStorage
    if (!localStorage.getItem('token')) {
      // Redirigir al login si no existe el token
      router.push('/login');
    }
  }, [router]);

  return (
      <div style={dashboardStyle}>
        <Sidebar role={role} />
        <div style={contentStyle}>
          <h1>Bienvenido al Dashboard</h1>
          <p>Contenido del dashboard...</p>
        </div>
      </div>
  );
};

const dashboardStyle = {
  display: 'flex',
};

const contentStyle = {
  marginLeft: '250px',
  padding: '20px',
  width: '100%',
};

export default Dashboard;