import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import styles from '../styles/DetallePrestamo.module.css';// Importar el archivo CSS

export default function DetallePrestamos() {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
      return;
    }

    // Realizar la solicitud para obtener los préstamos
    const fetchPrestamos = async () => {
      try {
        const res = await fetch('http://localhost:3002/api/prestamos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Agregar el token en el header
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener los préstamos');
        }

        const data = await res.json();
        setPrestamos(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchPrestamos();
  }, [router]);

  return (
    <div className={styles.detallePrestamoContainer}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <h1>Detalles de Préstamos</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {prestamos.length === 0 ? (
          <p className={styles.noDataMessage}>No tienes préstamos registrados.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Fecha</th>
                <th className={styles.th}>Monto</th>
                <th className={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo._id} className={styles.tr}>
                  <td className={styles.td}>{prestamo.fecha_inicio}</td> {/* Mostramos la fecha tal cual viene */}
                  <td className={styles.td}>{prestamo.monto}</td>
                  <td className={styles.td}>{prestamo.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
