import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/PagarCuotas.module.css';

interface Prestamo {
    id: string;
    monto: number;
    fecha_inicio: string;
    estado: string;
}

const PagarCuotas = () => {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState<string>("");
    const [monto, setMonto] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const role = localStorage.getItem('role') as 'administrador' | 'cliente';

    useEffect(() => {
        const fetchPrestamos = async () => {
            try {
                const res = await fetch("http://localhost:3002/api/prestamos", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error al obtener préstamos");
                }

                const data = await res.json();
                // Filtrar solo préstamos aprobados
                const prestamosAprobados = data.filter((prestamo: Prestamo) =>
                    prestamo.estado === 'aprobado'
                );
                setPrestamos(prestamosAprobados);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchPrestamos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            if (!selectedPrestamoId || monto <= 0) {
                setError("Por favor, seleccione un préstamo e ingrese un monto válido.");
                setLoading(false);
                return;
            }

            const res = await fetch("http://localhost:3003/api/pagos/realizar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ prestamoId: selectedPrestamoId, monto }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al realizar el pago.");
            }

            setSuccessMessage("Pago realizado con éxito.");
            setLoading(false);

            setTimeout(() => {
                router.push("/cliente/EstadoPagos");
            }, 2000);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <div className={styles.innerContainer}>
                <h1 className={styles.title}>Pagar Cuotas</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="prestamoId">Seleccione el Préstamo:</label>
                        <select
                            id="prestamoId"
                            value={selectedPrestamoId}
                            onChange={(e) => setSelectedPrestamoId(e.target.value)}
                            className={styles.input}
                            required
                        >
                            <option value="">Seleccione un préstamo</option>
                            {prestamos.map((prestamo) => (
                                <option key={prestamo.id} value={prestamo.id}>
                                    Préstamo #{prestamo.id} - Monto: ${prestamo.monto.toLocaleString()} -
                                    Fecha: {new Date(prestamo.fecha_inicio).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="monto">Monto a Pagar:</label>
                        <input
                            type="number"
                            id="monto"
                            value={monto}
                            onChange={(e) => setMonto(Number(e.target.value))}
                            className={styles.input}
                            placeholder="Ingrese el monto a pagar"
                            step="0.01"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? "Procesando..." : "Realizar Pago"}
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
};

export default PagarCuotas;