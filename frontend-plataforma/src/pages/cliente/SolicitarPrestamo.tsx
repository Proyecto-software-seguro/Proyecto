import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";

const SolicitarPrestamo = () => {
  const router = useRouter();
  const [role, setRole] = useState<'administrador' | 'cliente' | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [tasa, setTasa] = useState<number>(0);
  const [plazo, setPlazo] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si no hay token en localStorage
      if (!localStorage.getItem('token')) {
        // Redirigir al login si no existe el token
        router.push('/login');
      } else {
        // Recuperar el rol del usuario
        const storedRole = localStorage.getItem('role') as 'administrador' | 'cliente';
        setRole(storedRole);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
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

      setSuccessMessage("Préstamo solicitado con éxito.");
      setLoading(false);

      // Redirigir después de un breve tiempo
      setTimeout(() => {
        router.push("/cliente/DetallePrestamo");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Si no se ha cargado el rol, mostrar mensaje de carga
  if (!role) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={solicitarPrestamoStyle}>
      <Sidebar role={role} />
      <div style={contentStyle}>
        <h1>Solicitar un Préstamo</h1>
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
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