import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa'; // Icono de usuario
import styles from '../src/styles/Sidebar.module.css';

const Sidebar = () => {
  const userName = localStorage.getItem("userName"); // Recuperar el nombre del usuario

  const handleLogout = () => {
    // Limpiar el localStorage y redirigir al login
    localStorage.removeItem("userName");
    window.location.href = "/login"; // Redirigir a la página de login
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.usuario}>
        {/* Icono de usuario de Bootstrap */}
        <FaUserCircle />
        {userName && <p>{`Hola, ${userName}`}</p>} {/* Mostrar el nombre del usuario */}
      </div>
      
      <ul>
        <li>
          <Link href="/SolicitarPrestamo" className="text-white text-decoration-none py-2">
            Solicitar un Préstamo
          </Link>
        </li>
        <li>
          <Link href="/DetallePrestamo" className="text-white text-decoration-none py-2">
            Préstamos Pendientes
          </Link>
        </li>
        <li>
          <Link href="/pagar-cuotas" className="text-white text-decoration-none py-2">
            Pagar Cuotas
          </Link>
        </li>
      </ul>

      {/* Botón de Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;
