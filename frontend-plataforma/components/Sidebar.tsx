import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario
import styles from '../src/styles/Sidebar.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface SidebarProps {
    role: 'administrador' | 'cliente';
}

const Sidebar = ({ role }: SidebarProps) => {
    const router = useRouter();
    useEffect(() => {
        // Verificar si no hay token en localStorage
        if (!localStorage.getItem('token')) {
            // Redirigir al login si no existe el token
            router.push('/login');
        }
    }, [router]);

    const userName = localStorage.getItem("userName"); // Recuperar el nombre del usuario
    const handleLogout = () => {
        // Limpiar el localStorage y redirigir al login
        localStorage.removeItem("token");  // Asegúrate de remover el token también
        localStorage.removeItem("userName");  // Limpiar el nombre del usuario
        localStorage.removeItem("role");  // Limpiar el rol del usuario
        router.push('/login'); // Redirigir a la página de login
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.usuario}>
                {/* Icono de usuario de Bootstrap */}
                <FaUserCircle />
                {userName && <p>{`Hola, ${userName}`}</p>} {/* Mostrar el nombre del usuario */}
            </div>

            <ul>
                {role === 'administrador' ? (
                    <>
                        <li>
                            <Link href="/admin/GestionarPrestamos" className="text-white text-decoration-none py-2">
                                Gestionar Préstamos
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/HistorialPagos" className="text-white text-decoration-none py-2">
                                Historial de Pagos
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/AgregarDatosFinancieros" className="text-white text-decoration-none py-2">
                                Agregar Datos Financieros
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/AgregarHistorialCrediticio" className="text-white text-decoration-none py-2">
                                Agregar Historial Crediticio
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/VerPerfilUsuario" className="text-white text-decoration-none py-2">
                                Ver Perfil de Usuario
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/VerAmortizacion" className="text-white text-decoration-none py-2">
                                Ver Amortización
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/cliente/SolicitarPrestamo" className="text-white text-decoration-none py-2">
                                Solicitar un Préstamo
                            </Link>
                        </li>
                        <li>
                            <Link href="/cliente/DetallePrestamo" className="text-white text-decoration-none py-2">
                                Mis Préstamos
                            </Link>
                        </li>
                        <li>
                            <Link href="/cliente/PagarCuotas" className="text-white text-decoration-none py-2">
                                Pagar Cuotas
                            </Link>
                        </li>
                        <li>
                            <Link href="/cliente/HistorialCrediticio" className="text-white text-decoration-none py-2">
                                Mi Historial Crediticio
                            </Link>
                        </li>
                        <li>
                            <Link href="/cliente/DatosFinancieros" className="text-white text-decoration-none py-2">
                                Mis Datos Financieros
                            </Link>
                        </li>
                        <li>
                            <Link href="/cliente/EstadoPagos" className="text-white text-decoration-none py-2">
                                Estado de Pagos
                            </Link>
                        </li>
                    </>
                )}
            </ul>

            {/* Botón de Cerrar Sesión */}
            <button className={styles.logoutButton} onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
        </div>
    );
};

export default Sidebar;