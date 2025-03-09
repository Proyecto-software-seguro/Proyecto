import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/HistorialPagos.module.css';

interface Payment {
    id: string;
    usuario: string;
    monto: number;
    fecha_pago: string;
}

// Updated interface to match the actual data structure from the API
interface Usuario {
    financial_data?: {
        ingresos_mensuales: string;
        numero_cuenta: string;
    };
    credit_history?: Array<{
        id: string;
        fecha: string;
        descripcion: string;
        puntaje_crediticio: number;
    }>;
}

const HistorialPagos = () => {
    const router = useRouter();
    const [role, setRole] = useState<"administrador" | "cliente" | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [usuarios, setUsuarios] = useState<Record<string, Usuario>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Verificar si no hay token en localStorage
            if (!localStorage.getItem('token')) {
                router.push('/login');
                return;
            }
            
            const storedRole = localStorage.getItem('role') as "administrador" | "cliente";
            setRole(storedRole);
            
            // Solo los administradores pueden ver esta página
            if (storedRole !== 'administrador') {
                router.push('/dashboard');
                return;
            }
            
            fetchPayments();
        }
    }, [router]);

    const fetchPayments = async () => {
        try {
            // Obtener historial de pagos
            const res = await fetch("http://localhost:3003/api/pagos/historial", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error al cargar el historial de pagos");
            }

            const paymentsData = await res.json();
            console.log("Payments data:", paymentsData);
            setPayments(paymentsData);
            
            // Obtener IDs de usuarios únicos
            const userIds = [...new Set(paymentsData.map((payment: Payment) => payment.usuario))];
            console.log("User IDs to fetch:", userIds);
            
            // Obtener detalles de cada usuario
            const usuariosData: Record<string, Usuario> = {};
            for (const userId of userIds) {
                if (!userId) continue; // Skip if userId is null or undefined
                
                try {
                    console.log(`Fetching user data for ID: ${userId}`);
                    const userRes = await fetch(`http://localhost:3000/api/usuarios/perfil/${userId}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        console.log(`User data for ID ${userId}:`, userData);
                        usuariosData[userId] = userData;
                    } else {
                        console.error(`Error response for user ${userId}:`, userRes.status, userRes.statusText);
                    }
                } catch (error) {
                    console.error(`Error al obtener datos del usuario ${userId}:`, error);
                }
            }
            
            console.log("Final usuarios data:", usuariosData);
            setUsuarios(usuariosData);
            setLoading(false);
        } catch (err) {
            console.error("Error al cargar historial de pagos:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
            setLoading(false);
        }
    };

    if (!role) {
        return <p>Cargando...</p>;
    }

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <h1 className={styles.title}>Historial de Pagos</h1>
                
                {error && <p className={styles.errorMessage}>{error}</p>}
                {loading ? (
                    <p>Cargando historial de pagos...</p>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID Pago</th>
                                    <th>Usuario ID</th>
                                    <th>Monto</th>
                                    <th>Fecha de Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((payment: Payment) => (
                                        <tr key={payment.id}>
                                            <td>{payment.id}</td>
                                            <td>Usuario: {payment.usuario}</td>
                                            <td>${payment.monto.toFixed(2)}</td>
                                            <td>{new Date(payment.fecha_pago).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className={styles.noData}>No hay pagos registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialPagos;