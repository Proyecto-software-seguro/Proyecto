import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";

const VerAmortizacion = () => {
    const [amortizacion, setAmortizacion] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const role = localStorage.getItem("role") as "administrador" | "cliente";
    const { prestamoId } = router.query;

    useEffect(() => {
        if (role !== "administrador") {
            router.push("/dashboard");
        }

        const fetchAmortizacion = async () => {
            try {
                const res = await fetch(`http://localhost:3002/api/prestamos/amortizacion/${prestamoId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error al obtener la amortización");
                }

                const data = await res.json();
                setAmortizacion(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        if (prestamoId) {
            fetchAmortizacion();
        }
    }, [router, role, prestamoId]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
                <h1>Amortización del Préstamo</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>Número de Cuota</th>
                        <th>Monto de Cuota</th>
                        <th>Saldo Restante</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {amortizacion.map((cuota) => (
                        <tr key={cuota.id}>
                            <td>{cuota.numero_cuota}</td>
                            <td>{cuota.monto_cuota}</td>
                            <td>{cuota.saldo_restante}</td>
                            <td>{cuota.estado}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerAmortizacion;