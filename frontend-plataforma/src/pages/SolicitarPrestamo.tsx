import { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar"; // Se agrega la barra lateral

const SolicitarPrestamo = () => {
  const [monto, setMonto] = useState<number>(0);
  const [tasa, setTasa] = useState<number>(0);
  const [plazo, setPlazo] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (monto <= 0 || tasa <= 0 || plazo <= 0) {
        setError("Por favor, ingrese valores válidos.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3002/api/prestamos/solicitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ monto, tasa, plazo }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al solicitar el préstamo.");
      }

      router.push("/prestamos-pendientes");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={solicitarPrestamoStyle}>
      <Sidebar /> {/* Se muestra la barra lateral */}
      <div style={contentStyle}>
        <h1>Solicitar un Préstamo</h1>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="monto" className="form-label">Monto</label>
            <input
              type="number"
              className="form-control"
              id="monto"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tasa" className="form-label">Tasa de Interés (%)</label>
            <input
              type="number"
              className="form-control"
              id="tasa"
              value={tasa}
              onChange={(e) => setTasa(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="plazo" className="form-label">Plazo (en meses)</label>
            <input
              type="number"
              className="form-control"
              id="plazo"
              value={plazo}
              onChange={(e) => setPlazo(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Solicitar Préstamo"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos en línea para mantener la estructura como el Dashboard
const solicitarPrestamoStyle = {
  display: 'flex',
};

const contentStyle = {
  marginLeft: '250px',
  padding: '20px',
  width: '100%',
};

export default SolicitarPrestamo;
