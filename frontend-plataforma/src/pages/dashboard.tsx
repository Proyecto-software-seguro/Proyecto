import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const router = useRouter();
    const [role, setRole] = useState<'administrador' | 'cliente' | null>(null); // Estado para el rol

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Verificar si no hay token en localStorage
            if (!localStorage.getItem('token')) {
                // Redirigir al login si no existe el token
                router.push('/login');
            } else {
                // Recuperar el rol del usuario
                const storedRole = localStorage.getItem('role') as 'administrador' | 'cliente';
                setRole(storedRole);
            }
        }
    }, [router]);

    if (!role) {
        return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se verifica el rol
    }

    return (
        <div style={dashboardStyle}>
            <Sidebar role={role} />
            <div style={contentStyle}>
                <h1>Bienvenido a la Plataforma de Gestión de Préstamos y Pagos Seguros</h1>
                {role === 'administrador' ? (
                    <p>Hola Administrador, aquí podrás gestionar los préstamos y pagos seguros.</p>
                ) : (
                    <p>Hola Cliente, aquí podrás ver tus préstamos y realizar pagos seguros.</p>
                )}
                <div style={{ marginTop: '20px' }}>
                    <img
                        src='images/bienvenida.png'
                        alt="Bienvenida al Dashboard"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    />

                </div>
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
