import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar"; // Se agrega la barra lateral

interface Loan {
  id: string;
  monto: number;
  tasa: number;
  plazo: number;
  cuotaMensual: number;
  estado: string;
}

const DetallePrestamo = () => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { prestamoId } = router.query; // Obtener el ID del préstamo de la URL

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!prestamoId) return; // Si no hay ID, no hace nada

      try {
        const res = await fetch(`http://localhost:3002/api/loans/${prestamoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al obtener los detalles del préstamo.");
        }

        setLoan(data); // Establecer los detalles del préstamo
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [prestamoId]);

  return (
    <div style={detallePrestamoStyle}>
      <Sidebar /> {/* Se muestra la barra lateral */}
      <div style={contentStyle}>
        <h1>Detalle del Préstamo</h1>
        {error && <p className="text-danger">{error}</p>}

        {loading ? (
          <p>Cargando detalles del préstamo...</p>
        ) : (
          loan && (
            <div>
              <p><strong>ID del préstamo:</strong> {loan.id}</p>
              <p><strong>Monto solicitado:</strong> ${loan.monto}</p>
              <p><strong>Tasa de Interés:</strong> {loan.tasa}%</p>
              <p><strong>Plazo:</strong> {loan.plazo} meses</p>
              <p><strong>Cuota mensual:</strong> ${loan.cuotaMensual}</p>
              <p><strong>Estado:</strong> {loan.estado}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Estilos en línea para mantener la estructura como el Dashboard
const detallePrestamoStyle = {
  display: 'flex',
};

const contentStyle = {
  marginLeft: '250px',
  padding: '20px',
  width: '100%',
};

export default DetallePrestamo;
