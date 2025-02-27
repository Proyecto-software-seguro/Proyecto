import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../components/Sidebar';
import styles from '../../styles/DetallePrestamoTotal.module.css';

export default function DetallePrestamoTotal() {
  const router = useRouter();
  const { prestamoId } = router.query; // Captura el parámetro de la URL
  const [prestamo, setPrestamo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'administrador' | 'cliente' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') as 'administrador' | 'cliente';

      if (!token) {
        router.push('/login');
        return;
      }

      setRole(role);

      const fetchPrestamo = async () => {
        try {
          const res = await fetch(`http://localhost:3002/api/prestamos/${prestamoId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error('Error al obtener el préstamo');
          }

          const data = await res.json();
          setPrestamo(data);
        } catch (error: any) {
          setError(error.message);
        }
      };

      if (prestamoId) {
        fetchPrestamo();
      }
    }
  }, [router, prestamoId]);

  return (
    <div className={styles.detallePrestamoTotalContainer}>
      {role && <Sidebar role={role} />}
      <div className={styles.contentContainer}>
        <h1>Detalle del Préstamo</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {prestamo ? (
          <div>
            <p><strong>Fecha de Inicio:</strong> {new Date(prestamo.fecha_inicio).toLocaleString()}</p>
            <p><strong>Monto:</strong> ${prestamo.monto.toLocaleString()}</p>
            <p><strong>Tasa:</strong> {prestamo.tasa}%</p>
            <p><strong>Plazo:</strong> {prestamo.plazo} meses</p>
            <p><strong>Cuota Mensual:</strong> ${prestamo.cuota_mensual.toLocaleString()}</p>
            <p><strong>Estado:</strong> {prestamo.estado.replace(/_/g, ' ')}</p>
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </div>
    </div>
  );
}
