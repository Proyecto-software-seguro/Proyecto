import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";

const GestionarPrestamos = () => {
    const [prestamosPendientes, setPrestamosPendientes] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const role = localStorage.getItem("role") as "administrador" | "cliente";

    useEffect(() => {
        if (role !== "administrador") {
            router.push("/dashboard");
        }

        const fetchPrestamosPendientes = async () => {
            try {
                const res = await fetch("http://localhost:3002/api/prestamos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error al obtener préstamos pendientes");
                }

                const data = await res.json();
                setPrestamosPendientes(data.filter((p: any) => p.estado === "pendiente_aprobacion"));
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchPrestamosPendientes();
    }, [router, role]);

    const handleAprobar = async (prestamoId: string) => {
        try {
            const res = await fetch("http://localhost:3002/api/prestamos/aprobar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ prestamoId }),
            });

            if (!res.ok) {
                throw new Error("Error al aprobar el préstamo");
            }

            setSuccessMessage("Préstamo aprobado con éxito.");
            setPrestamosPendientes((prev) => prev.filter((p) => p.id !== prestamoId));
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleRechazar = async (prestamoId: string) => {
        try {
            const res = await fetch("http://localhost:3002/api/prestamos/rechazar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ prestamoId }),
            });

            if (!res.ok) {
                throw new Error("Error al rechazar el préstamo");
            }

            setSuccessMessage("Préstamo rechazado con éxito.");
            setPrestamosPendientes((prev) => prev.filter((p) => p.id !== prestamoId));
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
                <h1>Gestionar Préstamos</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Monto</th>
                        <th>Plazo</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {prestamosPendientes.map((prestamo) => (
                        <tr key={prestamo.id}>
                            <td>{prestamo.id}</td>
                            <td>{prestamo.monto}</td>
                            <td>{prestamo.plazo} meses</td>
                            <td>
                                <button
                                    style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}
                                    onClick={() => handleAprobar(prestamo.id)}
                                >
                                    Aprobar
                                </button>
                                <button
                                    style={{ backgroundColor: "red", color: "white" }}
                                    onClick={() => handleRechazar(prestamo.id)}
                                >
                                    Rechazar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionarPrestamos;