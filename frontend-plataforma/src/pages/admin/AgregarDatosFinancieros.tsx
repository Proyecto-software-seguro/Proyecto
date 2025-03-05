import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/AgregarDatosFinancieros.module.css';

const AgregarDatosFinancieros = () => {
    const router = useRouter();
    const [role, setRole] = useState<"administrador" | "cliente" | null>(null);
    const [usuarioId, setUsuarioId] = useState<string>("");
    const [ingresosMensuales, setIngresosMensuales] = useState<number>(0);
    const [numeroCuenta, setNumeroCuenta] = useState<string>("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            if (role !== "administrador") {
                throw new Error("Solo los administradores pueden agregar datos financieros.");
            }

            const res = await fetch("http://localhost:3000/api/usuarios/financiero", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ usuarioId, ingresosMensuales, numeroCuenta }),
            });

            if (!res.ok) {
                throw new Error("Error al agregar los datos financieros.");
            }

            setSuccessMessage("Datos financieros agregados con éxito.");
            setUsuarioId("");
            setIngresosMensuales(0);
            setNumeroCuenta("");
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
                <h1 className={styles.title}>Agregar Datos Financieros</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="usuarioId">ID del Usuario:</label>
                        <input
                            type="text"
                            id="usuarioId"
                            value={usuarioId}
                            onChange={(e) => setUsuarioId(e.target.value)}
                            className={styles.input}
                            placeholder="Ingrese el ID del usuario"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="ingresosMensuales">Ingresos Mensuales:</label>
                        <input
                            type="number"
                            id="ingresosMensuales"
                            value={ingresosMensuales}
                            onChange={(e) => setIngresosMensuales(Number(e.target.value))}
                            className={styles.input}
                            placeholder="Ingrese los ingresos mensuales"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="numeroCuenta">Número de Cuenta:</label>
                        <input
                            type="text"
                            id="numeroCuenta"
                            value={numeroCuenta}
                            onChange={(e) => setNumeroCuenta(e.target.value)}
                            className={styles.input}
                            placeholder="Ingrese el número de cuenta"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Agregar Datos Financieros</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarDatosFinancieros;