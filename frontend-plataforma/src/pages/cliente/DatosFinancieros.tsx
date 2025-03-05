import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../components/Sidebar';
import styles from '../../styles/DatosFinancieros.module.css';

interface FinancialData {
    ingresos_mensuales: number;
    numero_cuenta: string;
}

export default function DatosFinancieros() {
    const router = useRouter();
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'administrador' | 'cliente' | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role') as 'administrador' | 'cliente';
            const id_usuario= localStorage.getItem('id_usuario'); // Captura el userId del localStorage

            if (!token) {
                router.push('/login');
                return;
            }

            setRole(role);

            const fetchFinancialData = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/api/usuarios/${id_usuario}/datos-financieros`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error('Error al obtener los datos financieros');
                    }

                    const data = await res.json();
                    setFinancialData(data);
                } catch (error: any) {
                    setError(error.message);
                }
            };

            fetchFinancialData();
        }
    }, [router]);

    return (
        <div className={styles.datosFinancierosContainer}>
            {role && <Sidebar role={role} />}
            <div className={styles.contentContainer}>
                <h1>Datos Financieros</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}

                {financialData ? (
                    <div className={styles.financialData}>
                        <div className={styles.dataRow}>
                            <span className={styles.label}>Ingresos Mensuales:</span>
                            <span className={styles.value}>${financialData.ingresos_mensuales.toLocaleString()}</span>
                        </div>
                        <div className={styles.dataRow}>
                            <span className={styles.label}>Número de Cuenta:</span>
                            <span className={styles.value}>{financialData.numero_cuenta}</span>
                        </div>
                    </div>
                ) : (
                    <p>No hay datos financieros registrados.</p>
                )}
            </div>
        </div>
    );
}