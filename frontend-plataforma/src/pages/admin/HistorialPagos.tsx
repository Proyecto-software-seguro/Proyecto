import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/HistorialPagos.module.css';

interface Pago {
    id: string;
    usuario: string;
    monto: number;
    fecha_pago: string;
}

const HistorialPagos = () => {
    const [historialPagos, setHistorialPagos] = useState<Pago[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [role, setRole] = useState<"administrador" | "cliente" | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token || userRole !== "administrador") {
            router.push("/login");
            return;
        }

        setRole(userRole as "administrador" | "cliente");

        const fetchHistorialPagos = async () => {
            try {
                const res = await fetch("http://localhost:3003/api/pagos/historial", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    credentials: 'include'
                });

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("La respuesta no es JSON válido");
                }

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Error al obtener el historial de pagos");
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setHistorialPagos(data);
                } else {
                    throw new Error("Formato de datos inválido");
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : "Error al obtener el historial de pagos");
            }
        };

        fetchHistorialPagos();
    }, [router]);

    if (!role) {
        return null;
    }

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <h1 className={styles.title}>Historial de Pagos</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {historialPagos.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                        </tr>
                        </thead>
                        <tbody>
                        {historialPagos.map((pago) => (
                            <tr key={pago.id}>
                                <td>{pago.id}</td>
                                <td>{pago.usuario}</td>
                                <td>${pago.monto.toLocaleString()}</td>
                                <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay pagos registrados</p>
                )}
            </div>
        </div>
    );
};

export default HistorialPagos;