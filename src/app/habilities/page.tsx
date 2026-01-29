'use client';
import { useEffect, useState } from 'react';
import '../styles/dashboard.css';

interface Skill { IdHabilidad: string; Habilidad: string; }
interface Jockey { Id: string; Nombre: string; }
interface Asignacion { idJockey: string; nombreJockey: string; habilidadAsignada: string; }

export default function HabilitiesPage() {
  const [jockeys, setJockeys] = useState<Jockey[]>([]);
  const [catalogo, setCatalogo] = useState<Skill[]>([]);
  const [seleccion, setSeleccion] = useState({ idJockey: '', idHabilidad: '' });
  const [nuevaHabilidad, setNuevaHabilidad] = useState({ id: '', nombre: '' });
  const [registrosTabla, setRegistrosTabla] = useState<Asignacion[]>([]);
  const [editando, setEditando] = useState<Asignacion | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const API_URL = 'http://localhost:63015/api';

  const cargarDatos = () => {
    fetch(`${API_URL}/jockeys`)
      .then(res => res.json())
      .then(json => {
        setJockeys(json.jockeys || []);
        setCatalogo(json.habilidades || []);
        setRegistrosTabla(json.asignaciones || []);
      })
      .catch(err => console.error("Error cargando datos:", err));
  };

  useEffect(() => { cargarDatos(); }, []);


  const preparEditar = (reg: Asignacion) => {
    setEditando(reg);
    const idLimpio = reg.idJockey.replace('#', '');
    const habOriginal = catalogo.find(h => h.Habilidad === reg.habilidadAsignada);
    setSeleccion({ idJockey: idLimpio, idHabilidad: habOriginal?.IdHabilidad || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (idJockey: string) => {
    if (!confirm("¿Desea eliminar este registro?")) return;
    const idLimpio = idJockey.replace('#', '');
    try {
      const res = await fetch(`${API_URL}/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idJockey: idLimpio, idHabilidad: "", eliminar: true })
      });
      if (res.ok) {
        cargarDatos();
        alert("Eliminado con éxito");
      }
    } catch (err) { console.error(err); }
  };


  const handleConfirmarAsignacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seleccion.idJockey || !seleccion.idHabilidad) return alert("Selecciona Jockey y Habilidad");
    
    try {
      const res = await fetch(`${API_URL}/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idJockey: seleccion.idJockey,
          idHabilidad: seleccion.idHabilidad,
          eliminar: false,
          Insertar: editando ? "" : "Nueva" 
        })
      });

      if (res.ok) {
        setEditando(null);
        setSeleccion({ idJockey: '', idHabilidad: '' });
        cargarDatos();
        alert("¡Operación exitosa!");
      }
    } catch (err) { console.error(err); }
  };


  const handleCrearHabilidadBase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaHabilidad.id || !nuevaHabilidad.nombre) return alert("Faltan datos de la nueva habilidad");

    try {

      const res = await fetch(`${API_URL}/habilidades-maestro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          AA1iA: nuevaHabilidad.id,
          AA1lA: nuevaHabilidad.nombre
        })
      });

      if (res.ok) {
        alert("Habilidad agregada al catálogo maestro");
        setNuevaHabilidad({ id: '', nombre: '' });
        cargarDatos(); 
      } else {
        const errData = await res.json();
        alert("Error: " + (errData.mensaje || "No se pudo registrar ese codigo ya esta en uso"));
      }
    } catch (err) { alert("Error de conexión"); }
  };

  return (
    <>
      <div className="top-bar">
        <h2 className="page-title">Gestión de Jockeys y Habilidades</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        

        <div className="data-card form-container">
          <h3 className="card-header">1. Registrar Nueva Habilidad</h3>
          <form onSubmit={handleCrearHabilidadBase} style={{padding:'20px'}}>
            <div className="form-group">
              <label>Código (00)</label>
              <input 
                type="text" className="select-custom"
                value={nuevaHabilidad.id}
                onChange={(e) => setNuevaHabilidad({...nuevaHabilidad, id: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Nombre de Habilidad</label>
              <input 
                type="text" className="select-custom" 
                value={nuevaHabilidad.nombre}
                onChange={(e) => setNuevaHabilidad({...nuevaHabilidad, nombre: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-confirm">Ingresar Habilidad</button>
          </form>
        </div>


        <div className="data-card form-container">
          <h3 className="card-header" style={{padding:'20px'}}>2. Vincular Habilidad a Jockey</h3>
          <form onSubmit={handleConfirmarAsignacion} style={{padding:'20px'}}>
            <div className="form-group">
              <label>Jockey</label>
              <select 
                className="select-custom" value={seleccion.idJockey} disabled={!!editando}
                onChange={(e)=>setSeleccion({...seleccion, idJockey:e.target.value})}
              >
                <option value="">Seleccione un Jockey...</option>
                {jockeys.map(j => <option key={j.Id} value={j.Id}>{j.Nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Habilidad</label>
              <select 
                className="select-custom" value={seleccion.idHabilidad}
                onChange={(e)=>setSeleccion({...seleccion, idHabilidad:e.target.value})}
              >
                <option value="">Seleccione Habilidad...</option>
                {catalogo.map(h => <option key={h.IdHabilidad} value={h.IdHabilidad}>{h.Habilidad}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-confirm">
              {editando ? "Guardar Cambios" : "Asignar Habilidad"}
            </button>
            {editando && <button type="button" onClick={() => {setEditando(null); setSeleccion({idJockey:'', idHabilidad:''})}}>Cancelar</button>}
          </form>
        </div>
      </div>


      <div className="form-group" style={{marginTop: '30px'}}>
        <div style={{padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3>Registros en Base de Datos</h3>
          <input 
            type="text" placeholder="Filtrar por nombre..." className="select-custom" style={{width:'250px'}} 
            value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} 
          />
        </div>
        <table className="pro-table">
          <thead>
            <tr><th>ID</th><th>NOMBRE JOCKEY</th><th>HABILIDAD</th><th>ACCIONES</th></tr>
          </thead>
          <tbody>
            {registrosTabla
              .filter(r => r.nombreJockey.toLowerCase().includes(busqueda.toLowerCase()))
              .map((r, i) => (
                <tr key={`${r.idJockey}-${i}`}>
                  <td>{r.idJockey}</td>
                  <td>{r.nombreJockey}</td>
                  <td><span className="badge-green">{r.habilidadAsignada}</span></td>
                  <td>
                    <button onClick={() => preparEditar(r)} style={{color: 'blue', border:'none', background:'none', cursor:'pointer', marginRight:'10px'}}>Editar</button>
                    <button onClick={() => handleEliminar(r.idJockey)} style={{color: 'red', border:'none', background:'none', cursor:'pointer'}}>Eliminar</button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}