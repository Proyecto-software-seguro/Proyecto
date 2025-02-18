import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Register.module.css';

export default function Register() {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rol, setRol] = useState<string>("cliente");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("Av. Siempre Viva 123, Springfield");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verificar que los campos no estén vacíos
    if (!nombre || !email || !password || !direccion || !fechaNacimiento) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // Realizamos la solicitud POST al backend para registrar al usuario
      const res = await fetch("http://localhost:3000/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol, fechaNacimiento, direccion }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar al usuario.");
      }

      // Redirigir al login después de registrar
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['register-page']}>
  <div className={styles.container}>
    <h1 className={styles.title}>Registrarse</h1>
    {error && <p className={styles['error-message']}>{error}</p>}
    <form onSubmit={handleSubmit}>
      <input
        className={styles['input-field']}
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        className={styles['input-field']}
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles['input-field']}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        className={styles['input-field']}
        type="text"
        placeholder="Rol (cliente o admin)"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
      />
      <input
        className={styles['input-field']}
        type="date"
        placeholder="Fecha de Nacimiento"
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
        required
      />
      <input
        className={styles['input-field']}
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
      <button className={styles['submit-button']} type="submit">Registrarse</button>
    </form>
  </div>
</div>

  );
}
