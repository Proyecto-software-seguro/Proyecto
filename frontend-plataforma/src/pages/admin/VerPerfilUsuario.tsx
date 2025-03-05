import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/VerPerfilUsuario.module.css';

const VerPerfilUsuario = () => {
    const router = useRouter();
    const [role, setRole] = useState<"administrador" | "cliente" | null>(null);
    const [usuarioId, setUsuarioId] = useState<string>("");
    const [perfil, setPerfil] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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

        try {
            if (role !== "administrador") {
                throw new Error("Solo los administradores pueden ver perfiles de usuarios.");
            }

            const res = await fetch(`http://localhost:3000/api/usuarios/perfil/${usuarioId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error al obtener el perfil del usuario.");
            }

            const data = await res.json();
            setPerfil(data);
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
                <h1 className={styles.title}>Ver Perfil de Usuario</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="usuarioId" className={styles.label}>ID del Usuario:</label>
                        <input
                            type="text"
                            id="usuarioId"
                            value={usuarioId}
                            onChange={(e) => setUsuarioId(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Buscar Perfil</button>
                </form>

                {perfil && (
                    <div>
                        <h2>Datos Financieros</h2>
                        <p>Ingresos Mensuales: {perfil.financial_data?.ingresos_mensuales || "N/A"}</p>
                        <p>Número de Cuenta: {perfil.financial_data?.numero_cuenta || "N/A"}</p>

                        <h2>Historial Crediticio</h2>
                        {perfil.credit_history.length > 0 ? (
                            <ul>
                                {perfil.credit_history.map((historial: any) => (
                                    <li key={historial.id}>
                                        <p>Fecha: {new Date(historial.fecha).toLocaleDateString()}</p>
                                        <p>Descripción: {historial.descripcion}</p>
                                        <p>Puntaje: {historial.puntaje_crediticio}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay historial crediticio registrado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerPerfilUsuario;