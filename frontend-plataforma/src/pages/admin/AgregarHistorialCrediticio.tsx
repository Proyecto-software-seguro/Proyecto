import { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/AgregarHistorialCrediticio.module.css';// Importar el CSS

const AgregarHistorialCrediticio = () => {
    const [usuarioId, setUsuarioId] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [puntaje, setPuntaje] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const role = localStorage.getItem("role") as "administrador" | "cliente";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            if (role !== "administrador") {
                throw new Error("Solo los administradores pueden agregar historial crediticio.");
            }

            const res = await fetch("http://localhost:3000/api/usuarios/crediticio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ usuarioId, descripcion, puntaje }),
            });

            if (!res.ok) {
                throw new Error("Error al agregar el historial crediticio.");
            }

            setSuccessMessage("Historial crediticio agregado con éxito.");
            setUsuarioId("");
            setDescripcion("");
            setPuntaje(0);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div className={styles.container}>
                <h1 className={styles.title}>Agregar Historial Crediticio</h1>
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
                        <label className={styles.label} htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className={styles.textarea}
                            placeholder="Ingrese una descripción"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="puntaje">Puntaje Crediticio:</label>
                        <input
                            type="number"
                            id="puntaje"
                            value={puntaje}
                            onChange={(e) => setPuntaje(Number(e.target.value))}
                            className={styles.input}
                            placeholder="Ingrese el puntaje crediticio"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Agregar Historial Crediticio</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarHistorialCrediticio;