import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../components/Sidebar';
import styles from '../../styles/EstadoPagos.module.css';

interface Prestamo {
    id: string;
    monto: number;
    tasa: number;
    plazo: number;
    cuota_mensual: number;
    estado: string;
    fecha_inicio: string;
}

interface Amortization {
    id: string;
    numero_cuota: number;
    monto_cuota: number;
    saldo_restante: number;
    estado: string;
}

export default function EstadoPagos() {
    const router = useRouter();
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState<string | null>(null);
    const [amortization, setAmortization] = useState<Amortization[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'administrador' | 'cliente' | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Usamos el operador de fusión nula para asignar un valor predeterminado si el token es null o undefined
            const token = localStorage.getItem('token') ?? null;

            // Usamos el operador de fusión nula para asignar un valor predeterminado si el role es null o undefined
            const role = localStorage.getItem('role') as 'administrador' | 'cliente' ?? 'cliente';

            if (!token) {
                router.push('/login');
                return;
            }

            setRole(role);

            const fetchPrestamos = async () => {
                try {
                    const res = await fetch('http://localhost:3002/api/prestamos', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error('');
                    }

                    const data = await res.json();
                    setPrestamos(data);
                } catch (error: any) {
                    setError(error.message);
                }
            };

            fetchPrestamos();
        }
    }, [router]);

    const handlePrestamoChange = async (prestamoId: string) => {
        setSelectedPrestamoId(prestamoId);
        setError(null);

        try {
            // Usamos el operador de fusión nula para asignar un valor predeterminado si el token es null o undefined
            const token = localStorage.getItem('token') ?? null;

            const res = await fetch(`http://localhost:3002/api/prestamos/amortizacion/${prestamoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Error al obtener la amortización');
            }

            const data = await res.json();

            // Ordenar las cuotas por número de cuota antes de guardarlas en el estado
            const sortedAmortization = data.sort((a: Amortization, b: Amortization) =>
                a.numero_cuota - b.numero_cuota
            );
            setAmortization(sortedAmortization);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.estadoPagosContainer}>
            {role && <Sidebar role={role} />}
            <div className={styles.contentContainer}>
                <h1>Estado de Pagos</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}

                <div className={styles.prestamoSelector}>
                    <label htmlFor="prestamo">Selecciona un préstamo:</label>
                    <select
                        id="prestamo"
                        onChange={(e) => handlePrestamoChange(e.target.value)}
                        value={selectedPrestamoId ?? ''}
                    >
                        <option value="">-- Selecciona un préstamo --</option>
                        {prestamos.map((prestamo) => (
                            <option key={prestamo.id} value={prestamo.id}>
                                Préstamo #{prestamo.id} - ${prestamo.monto.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedPrestamoId && (
                    <>
                        <h2>Amortización</h2>
                        {amortization.length > 0 ? (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Número de Cuota</th>
                                        <th>Monto de Cuota</th>
                                        <th>Saldo Restante</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amortization.map((cuota) => (
                                        <tr key={cuota.id}>
                                            <td>{cuota.numero_cuota}</td>
                                            <td>${cuota.monto_cuota.toLocaleString()}</td>
                                            <td>${cuota.saldo_restante.toLocaleString()}</td>
                                            <td>{cuota.estado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay datos de amortización disponibles.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}