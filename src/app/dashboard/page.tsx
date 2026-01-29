'use client';
import { useEffect, useState } from 'react';
import '../styles/dashboard.css';

interface JockeyResumen {
  Id: string;
  Nombre: string;
  Genero: string;
  Division: string;
  Habilidad: string;
  FechaRegistro?: string;
}

export default function DashboardPage() {
  const [datos, setDatos] = useState<JockeyResumen[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch(`http://localhost:63015/api/resumen-general?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(json => {
        const dataArray = Array.isArray(json) ? json : [];
        const unicos = dataArray.filter((v, i, a) => a.findIndex(t => t.Id === v.Id) === i);
        setDatos(unicos);
      })
      .catch(err => console.error("Error cargando resumen:", err));
  }, []);

  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) return "N/A";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const datosFiltrados = datos.filter(j => 
    (j.Nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (j.Id || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="top-bar">
        <h2 className="page-title">Resumen General de Jockeys</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID..." 
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      
      <div className="data-card">
        <h3 className="card-header" style={{ padding: '20px' }}>Registro de Jockey</h3>
        <table className="pro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>GÉNERO</th>
              <th>DIVISIÓN</th>
              <th>HABILIDAD ASIGNADA</th>
              <th>FECHA VINCULACIÓN</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length > 0 ? (
              datosFiltrados.map((j) => (
                <tr key={j.Id}>
                  <td className="jockey-id">#{j.Id}</td>
                  <td className="jockey-name">{j.Nombre}</td>
                  <td>{j.Genero}</td>
                  <td>{j.Division}</td>
                  <td style={{ fontSize: '1rem' , color : '#666'}}>
                    <span className={j.Habilidad === 'Sin asignar' ? 'badge-gray' : 'badge-green'}>
                      {j.Habilidad}
                    </span>
                  </td>
                  <td style={{ fontSize: '1rem', color: '#666' }}>
                    {formatearFecha(j.FechaRegistro)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}