import { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";

const AgregarDatosFinancieros = () => {
    const [usuarioId, setUsuarioId] = useState<string>("");
    const [ingresosMensuales, setIngresosMensuales] = useState<number>(0);
    const [numeroCuenta, setNumeroCuenta] = useState<string>("");
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

    return (
        <div style={{ display: "flex" }}>
            <Sidebar role={role} />
            <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
                <h1>Agregar Datos Financieros</h1>
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
                        <label htmlFor="ingresosMensuales">Ingresos Mensuales:</label>
                        <input
                            type="number"
                            id="ingresosMensuales"
                            value={ingresosMensuales}
                            onChange={(e) => setIngresosMensuales(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="numeroCuenta">Número de Cuenta:</label>
                        <input
                            type="text"
                            id="numeroCuenta"
                            value={numeroCuenta}
                            onChange={(e) => setNumeroCuenta(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Agregar Datos Financieros</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarDatosFinancieros;