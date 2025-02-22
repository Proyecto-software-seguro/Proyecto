import { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";

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
            <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
                <h1>Agregar Historial Crediticio</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="usuarioId">ID del Usuario:</label>
                        <input
                            type="text"
                            id="usuarioId"
                            value={usuarioId}
                            onChange={(e) => setUsuarioId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="puntaje">Puntaje Crediticio:</label>
                        <input
                            type="number"
                            id="puntaje"
                            value={puntaje}
                            onChange={(e) => setPuntaje(Number(e.target.value))}
                            required
                        />
                    </div>
                    <button type="submit">Agregar Historial Crediticio</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarHistorialCrediticio;