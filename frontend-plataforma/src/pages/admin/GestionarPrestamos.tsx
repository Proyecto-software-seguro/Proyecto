import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/GestionarPrestamos.module.css';

const GestionarPrestamos = () => {
    const router = useRouter();
    const [role, setRole] = useState<"administrador" | "cliente" | null>(null);
    const [prestamosPendientes, setPrestamosPendientes] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Verificar si no hay token en localStorage
            if (!localStorage.getItem('token')) {
                // Redirigir al login si no existe el token
                router.push('/login');
            } else {
                // Recuperar el rol del usuario
                const storedRole = localStorage.getItem("role") as "administrador" | "cliente";
                setRole(storedRole);
            }
        }
    }, [router]);

    useEffect(() => {
        // Solo intentar cargar préstamos si el rol es de administrador
        if (role === "administrador") {
            const fetchPrestamosPendientes = async () => {
                try {
                    const res = await fetch("http://localhost:3002/api/prestamos/", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error("Error al cargar los préstamos");
                    }

                    const data = await res.json();
                    setPrestamosPendientes(data.filter((p: any) => p.estado === "pendiente_aprobacion"));
                } catch (error: any) {
                    setError(error.message);
                }
            };

            fetchPrestamosPendientes();
        } else if (role === "cliente") {
            // Redirigir a dashboard si no es administrador
            router.push("/dashboard");
        }
    }, [role, router]);

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

    // Si no se ha cargado el rol, mostrar mensaje de carga
    if (!role) {
        return <p>Cargando...</p>;
    }

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <h1 className={styles.title}>Gestionar Préstamos</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                <table className={styles.table}>
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
                                    className={`${styles.actionButton} ${styles.approve}`}
                                    onClick={() => handleAprobar(prestamo.id)}
                                >
                                    Aprobar
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.reject}`}
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