import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../components/Sidebar';
import styles from '../../styles/HistorialCrediticio.module.css';

interface CreditHistory {
    descripcion: string;
    puntaje: number;
    fecha: string;
}

export default function HistorialCrediticio() {
    const router = useRouter();
    const [creditHistory, setCreditHistory] = useState<CreditHistory[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'administrador' | 'cliente' | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role') as 'administrador' | 'cliente';
            const id_usuario = localStorage.getItem('id_usuario'); // Captura el userId del localStorage

            if (!token) {
                router.push('/login');
                return;
            }

            setRole(role);

            const fetchCreditHistory = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/api/usuarios/${id_usuario}/historial-crediticio`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error('Error al obtener el historial crediticio');
                    }

                    const data = await res.json();
                    setCreditHistory(data);
                } catch (error: any) {
                    setError(error.message);
                }
            };

            fetchCreditHistory();
        }
    }, [router]);

    return (
        <div className={styles.historialCrediticioContainer}>
            {role && <Sidebar role={role} />}
            <div className={styles.contentContainer}>
                <h1>Historial Crediticio</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}

                {creditHistory ? (
                    <div className={styles.creditHistory}>
                        {creditHistory.map((history, index) => (
                            <div key={index} className={styles.historyItem}>
                                <div className={styles.dataRow}>
                                    <span className={styles.label}>Descripción:</span>
                                    <span className={styles.value}>{history.descripcion}</span>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.label}>Puntaje:</span>
                                    <span className={styles.value}>{history.puntaje}</span>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.label}>Fecha:</span>
                                    <span className={styles.value}>{new Date(history.fecha).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No hay historial crediticio registrado.</p>
                )}
            </div>
        </div>
    );
}