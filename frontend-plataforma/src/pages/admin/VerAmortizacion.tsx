import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/VerAmortizacion.module.css';

interface Prestamo {
    id: string;
    monto: number;
    plazo: number;
    tasa_interes: number;
}

interface Amortizacion {
    id: string;
    numero_cuota: number;
    monto_cuota: number;
    saldo_restante: number;
    estado: string;
}

const VerAmortizacion = () => {
    const router = useRouter();
    const [clienteId, setClienteId] = useState("");
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState("");
    const [amortizacion, setAmortizacion] = useState<Amortizacion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<"administrador" | "cliente" | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token || userRole !== "administrador") {
            router.push("/login");
            return;
        }

        setRole(userRole as "administrador" | "cliente");
    }, [router]);

    const handleBuscarPrestamos = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setPrestamos([]);
        setSelectedPrestamoId("");
        setAmortizacion([]);

        if (!clienteId.trim()) {
            setError("Por favor ingrese un ID de cliente válido");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3002/api/prestamos/cliente/${clienteId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al obtener préstamos");
            }

            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setPrestamos(data);
            } else {
                throw new Error("No hay préstamos registrados para este cliente");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    const handlePrestamoChange = async (prestamoId: string) => {
        setSelectedPrestamoId(prestamoId);
        setAmortizacion([]);
        setError(null);

        if (!prestamoId) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3002/api/prestamos/amortizacion/${prestamoId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al obtener amortización");
            }

            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setAmortizacion(data.sort((a, b) => a.numero_cuota - b.numero_cuota));
            } else {
                throw new Error("No hay tabla de amortización disponible");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    if (!role) {
        return null;
    }

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <h1 className={styles.title}>Ver Amortización de Préstamos</h1>

                <form onSubmit={handleBuscarPrestamos} className={styles.formGroup}>
                    <div>
                        <label className={styles.label}>ID del Cliente:</label>
                        <input
                            type="text"
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            className={styles.input}
                            placeholder="Ingrese el ID del cliente"
                            required
                        />
                        <button type="submit" className={styles.submitButton}>
                            Buscar Préstamos
                        </button>
                    </div>
                </form>

                {error && <p className={styles.errorMessage}>{error}</p>}

                {prestamos.length > 0 && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Seleccione Préstamo:</label>
                        <select
                            value={selectedPrestamoId}
                            onChange={(e) => handlePrestamoChange(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Seleccione un préstamo</option>
                            {prestamos.map((prestamo) => (
                                <option key={prestamo.id} value={prestamo.id}>
                                    Préstamo de ${prestamo.monto.toLocaleString()} - {prestamo.plazo} meses
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {amortizacion.length > 0 && (
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
                        {amortizacion.map((cuota) => (
                            <tr key={cuota.id}>
                                <td>{cuota.numero_cuota}</td>
                                <td>${cuota.monto_cuota.toLocaleString()}</td>
                                <td>${cuota.saldo_restante.toLocaleString()}</td>
                                <td>{cuota.estado}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VerAmortizacion;