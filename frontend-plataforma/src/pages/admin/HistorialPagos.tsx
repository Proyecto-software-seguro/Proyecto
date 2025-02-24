import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/HistorialPagos.module.css'; // Importar el CSS

const HistorialPagos = () => {
    const [historialPagos, setHistorialPagos] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const role = localStorage.getItem("role") as "administrador" | "cliente";

    useEffect(() => {
        if (role !== "administrador") {
            router.push("/dashboard");
        }

        const fetchHistorialPagos = async () => {
            try {
                const res = await fetch("http://localhost:3003/api/pagos/historial", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error al obtener el historial de pagos");
                }

                const data = await res.json();
                setHistorialPagos(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchHistorialPagos();
    }, [router, role]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <h1 className={styles.title}>Historial de Pagos</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
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
                            <td>{pago.monto}</td>
                            <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialPagos;