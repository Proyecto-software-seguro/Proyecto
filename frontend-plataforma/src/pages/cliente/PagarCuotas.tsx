import { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import styles from '../../styles/PagarCuotas.module.css'; // Importar el CSS

const PagarCuotas = () => {
  const [prestamoId, setPrestamoId] = useState<string>("");
  const [monto, setMonto] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const role = localStorage.getItem('role') as 'administrador' | 'cliente';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (!prestamoId || monto <= 0) {
        setError("Por favor, ingrese valores válidos.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3003/api/pagos/pagar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prestamoId, monto }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al realizar el pago.");
      }

      setSuccessMessage("Pago realizado con éxito.");
      setLoading(false);

      // Opcional: Redirigir después de un breve tiempo
      setTimeout(() => {
        router.push("/cliente/DetallePrestamo");
      }, 2000); // Redirige después de 2 segundos para que el usuario vea el mensaje
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role={role} />
      <div className={styles.container}>
        <h1 className={styles.title}>Pagar Cuotas</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="prestamoId">ID del Préstamo:</label>
            <input
              type="text"
              id="prestamoId"
              value={prestamoId}
              onChange={(e) => setPrestamoId(e.target.value)}
              className={styles.input}
              placeholder="Ingrese el ID del préstamo"
              required
            />
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
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Procesando..." : "Realizar Pago"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PagarCuotas;