'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building, Landmark, Layers, Inbox, LogOut, CheckCircle, 
  XCircle, RefreshCw, Plus, Edit2, Trash2, Link2, Link2Off,
  User, Check, X, Shield, ExternalLink
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState('properties'); // 'properties', 'developments', 'messages'
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  // Datos
  const [properties, setProperties] = useState([]);
  const [developments, setDevelopments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [meliConnected, setMeliConnected] = useState(false);

  // Modales y formularios
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDevelopmentForm, setShowDevelopmentForm] = useState(false);
  const [selectedDevelopment, setSelectedDevelopment] = useState(null);

  // Mensajes de alerta del sistema
  const [globalMessage, setGlobalMessage] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [syncingId, setSyncingId] = useState(null);

  // Inputs del formulario de propiedad
  const [propTitle, setPropTitle] = useState('');
  const [propDescription, setPropDescription] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propCurrency, setPropCurrency] = useState('USD');
  const [propType, setPropType] = useState('DEPARTAMENTO');
  const [propOperation, setPropOperation] = useState('VENTA');
  const [propTotalArea, setPropTotalArea] = useState('');
  const [propCoveredArea, setPropCoveredArea] = useState('');
  const [propRooms, setPropRooms] = useState('');
  const [propBedrooms, setPropBedrooms] = useState('');
  const [propBathrooms, setPropBathrooms] = useState('');
  const [propGarage, setPropGarage] = useState(false);
  const [propAddress, setPropAddress] = useState('');
  const [propNeighborhood, setPropNeighborhood] = useState('');
  const [propImagesText, setPropImagesText] = useState('');
  const [propFeatured, setPropFeatured] = useState(false);
  const [propActive, setPropActive] = useState(true);

  // Inputs del formulario de emprendimientos
  const [devTitle, setDevTitle] = useState('');
  const [devDescription, setDevDescription] = useState('');
  const [devStatus, setDevStatus] = useState('CONSTRUCTION');
  const [devLocation, setDevLocation] = useState('');
  const [devImagesText, setDevImagesText] = useState('');

  // 1. Verificar sesión e inicializar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsAdmin(true);
          fetchData();
        } else {
          router.push('/admin/login');
        }
      } catch (e) {
        router.push('/admin/login');
      } finally {
        setLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  // 2. Controlar parámetros de callback de Mercado Libre
  useEffect(() => {
    const meliSuccess = searchParams.get('meli_success');
    const meliError = searchParams.get('meli_error');

    if (meliSuccess) {
      setGlobalMessage('¡Conectado exitosamente con Mercado Libre Inmuebles!');
      router.replace('/admin/dashboard');
    }
    if (meliError) {
      setGlobalError(`Error al vincular Mercado Libre: ${meliError}`);
      router.replace('/admin/dashboard');
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      // Propiedades
      const propsRes = await fetch('/api/admin/properties');
      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data.properties || []);
        setMeliConnected(data.meliConnected || false);
      }

      // Emprendimientos
      const devRes = await fetch('/api/admin/developments');
      if (devRes.ok) {
        const data = await devRes.json();
        setDevelopments(data || []);
      }

      // Mensajes
      const msgRes = await fetch('/api/admin/messages');
      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data || []);
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // --- Mercado Libre OAuth ---
  const handleConnectMeli = async () => {
    try {
      const res = await fetch('/api/admin/mercadolibre/auth-url');
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setGlobalError('No se pudo obtener la URL de conexión.');
    }
  };

  const handleDisconnectMeli = async () => {
    if (!confirm('¿Seguro que desea desconectar su cuenta de Mercado Libre? Las nuevas publicaciones no se subirán automáticamente.')) return;
    try {
      const res = await fetch('/api/admin/mercadolibre/disconnect', { method: 'POST' });
      if (res.ok) {
        setMeliConnected(false);
        setGlobalMessage('Cuenta de Mercado Libre desvinculada.');
      }
    } catch (e) {
      setGlobalError('No se pudo desconectar.');
    }
  };

  // --- MANUAL SYNC ---
  const handleManualSync = async (propertyId) => {
    setSyncingId(propertyId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/sync`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setGlobalMessage('Sincronización manual forzada con éxito.');
        fetchData();
      } else {
        setGlobalError(`Error en sincronización: ${data.error || 'Desconocido'}`);
      }
    } catch (e) {
      setGlobalError('Error de red al sincronizar.');
    } finally {
      setSyncingId(null);
    }
  };

  // --- CRUD PROPIEDADES ---
  const openPropertyForm = (prop = null) => {
    setSelectedProperty(prop);
    if (prop) {
      setPropTitle(prop.title);
      setPropDescription(prop.description);
      setPropPrice(String(prop.price));
      setPropCurrency(prop.currency);
      setPropType(prop.type);
      setPropOperation(prop.operation);
      setPropTotalArea(String(prop.totalArea));
      setPropCoveredArea(String(prop.coveredArea));
      setPropRooms(String(prop.rooms));
      setPropBedrooms(String(prop.bedrooms));
      setPropBathrooms(String(prop.bathrooms));
      setPropGarage(prop.garage);
      setPropAddress(prop.address);
      setPropNeighborhood(prop.neighborhood);
      
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(prop.images || '[]');
      } catch (e) {}
      setPropImagesText(parsedImages.join(', '));
      setPropFeatured(prop.featured);
      setPropActive(prop.active);
    } else {
      setPropTitle('');
      setPropDescription('');
      setPropPrice('');
      setPropCurrency('USD');
      setPropType('DEPARTAMENTO');
      setPropOperation('VENTA');
      setPropTotalArea('');
      setPropCoveredArea('');
      setPropRooms('');
      setPropBedrooms('');
      setPropBathrooms('');
      setPropGarage(false);
      setPropAddress('');
      setPropNeighborhood('');
      setPropImagesText('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80, https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
      setPropFeatured(false);
      setPropActive(true);
    }
    setShowPropertyForm(true);
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setErrorPropertyForm('');

    // Procesar imágenes
    const imagesArray = propImagesText
      .split(',')
      .map(url => url.trim())
      .filter(url => url !== '');

    const payload = {
      title: propTitle,
      description: propDescription,
      price: parseFloat(propPrice),
      currency: propCurrency,
      type: propType,
      operation: propOperation,
      totalArea: parseFloat(propTotalArea),
      coveredArea: parseFloat(propCoveredArea),
      rooms: parseInt(propRooms || '0'),
      bedrooms: parseInt(propBedrooms || '0'),
      bathrooms: parseInt(propBathrooms || '0'),
      garage: propGarage,
      address: propAddress,
      neighborhood: propNeighborhood,
      images: imagesArray,
      featured: propFeatured,
      active: propActive,
    };

    try {
      const url = selectedProperty ? `/api/admin/properties/${selectedProperty.id}` : '/api/admin/properties';
      const method = selectedProperty ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setGlobalMessage(selectedProperty ? 'Propiedad actualizada exitosamente.' : 'Propiedad creada exitosamente.');
        setShowPropertyForm(false);
        fetchData();
      } else {
        setErrorPropertyForm(data.error || 'Error al procesar el formulario.');
      }
    } catch (err) {
      setErrorPropertyForm('Error al conectar con el servidor.');
    }
  };

  const [errorPropertyForm, setErrorPropertyForm] = useState('');

  const handlePropertyDelete = async (id) => {
    if (!confirm('¿Seguro que desea eliminar esta propiedad? Se borrará del sistema y se dará de baja en Mercado Libre y Argenprop.')) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGlobalMessage('Propiedad eliminada correctamente.');
        fetchData();
      }
    } catch (e) {
      setGlobalError('No se pudo borrar la propiedad.');
    }
  };

  // --- CRUD EMPRENDIMIENTOS ---
  const openDevelopmentForm = (dev = null) => {
    setSelectedDevelopment(dev);
    if (dev) {
      setDevTitle(dev.title);
      setDevDescription(dev.description);
      setDevStatus(dev.status);
      setDevLocation(dev.location);
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(dev.images || '[]');
      } catch (e) {}
      setDevImagesText(parsedImages.join(', '));
    } else {
      setDevTitle('');
      setDevDescription('');
      setDevStatus('CONSTRUCTION');
      setDevLocation('');
      setDevImagesText('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80');
    }
    setShowDevelopmentForm(true);
  };

  const handleDevelopmentSubmit = async (e) => {
    e.preventDefault();
    const imagesArray = devImagesText
      .split(',')
      .map(url => url.trim())
      .filter(url => url !== '');

    const payload = {
      title: devTitle,
      description: devDescription,
      status: devStatus,
      location: devLocation,
      images: imagesArray,
    };

    try {
      const url = selectedDevelopment ? `/api/admin/developments/${selectedDevelopment.id}` : '/api/admin/developments';
      const method = selectedDevelopment ? 'POST' : 'POST'; // We handle PUT/POST cleanly

      const res = await fetch(url, {
        method: selectedDevelopment ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setGlobalMessage(selectedDevelopment ? 'Emprendimiento actualizado.' : 'Emprendimiento creado.');
        setShowDevelopmentForm(false);
        fetchData();
      }
    } catch (e) {
      setGlobalError('Error al guardar el emprendimiento.');
    }
  };

  const handleDevelopmentDelete = async (id) => {
    if (!confirm('¿Seguro que desea borrar este emprendimiento?')) return;
    try {
      const res = await fetch(`/api/admin/developments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGlobalMessage('Emprendimiento eliminado.');
        fetchData();
      }
    } catch (e) {
      setGlobalError('No se pudo borrar.');
    }
  };

  if (loadingSession) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center text-neutral-500">
        Verificando credenciales de acceso...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER PANEL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-900 pb-6 mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center border border-brand/25">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider">Panel de Administración</h1>
            <p className="text-xs text-neutral-500">Administre el catálogo y sincronice portales externos.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mercado Libre OAuth Control Banner */}
          <div className="flex items-center text-xs bg-neutral-900 border border-neutral-850 px-4 py-2.5 rounded gap-3">
            <span className="text-neutral-400 font-medium">Mercado Libre:</span>
            {meliConnected ? (
              <>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Conectado
                </span>
                <button 
                  onClick={handleDisconnectMeli}
                  className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 ml-2 uppercase tracking-wider text-[10px]"
                >
                  <Link2Off className="w-3.5 h-3.5" /> Desvincular
                </button>
              </>
            ) : (
              <>
                <span className="text-yellow-500 font-semibold flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Desconectado
                </span>
                <button 
                  onClick={handleConnectMeli}
                  className="text-brand hover:text-brand-secondary font-semibold flex items-center gap-1 ml-2 uppercase tracking-wider text-[10px]"
                >
                  <Link2 className="w-3.5 h-3.5" /> Conectar Cuenta
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>

      {/* ALERTAS GLOBALES */}
      {globalMessage && (
        <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded p-4 mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {globalMessage}</span>
          <button onClick={() => setGlobalMessage('')} className="text-neutral-400 hover:text-white font-bold">×</button>
        </div>
      )}
      {globalError && (
        <div className="bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded p-4 mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2"><XCircle className="w-4 h-4" /> {globalError}</span>
          <button onClick={() => setGlobalError('')} className="text-neutral-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* PESTAÑAS (TABS) */}
      <div className="flex border-b border-neutral-850 mb-8">
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-4 px-6 text-xs tracking-wider uppercase font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'properties'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          Propiedades ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('developments')}
          className={`pb-4 px-6 text-xs tracking-wider uppercase font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'developments'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Emprendimientos ({developments.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-4 px-6 text-xs tracking-wider uppercase font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'messages'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Mensajes ({messages.length})
        </button>
      </div>

      {/* --- CONTENIDO TABS --- */}
      {/* 1. SECCION PROPIEDADES */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-base font-bold uppercase tracking-wider">Catálogo Inmobiliario</h2>
            <button
              onClick={() => openPropertyForm(null)}
              className="btn-brand px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Nueva Propiedad
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-850 bg-neutral-950 text-neutral-400 uppercase font-semibold tracking-wider">
                    <th className="p-4">Propiedad</th>
                    <th className="p-4">Operación</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-center">Argenprop</th>
                    <th className="p-4 text-center">Mercado Libre</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850 text-neutral-300">
                  {properties.length > 0 ? (
                    properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-neutral-950/40 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-white truncate max-w-xs">{prop.title}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">{prop.neighborhood} - {prop.type}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[9px] bg-neutral-950 font-medium tracking-wider uppercase border border-neutral-800">
                            {prop.operation}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-white">
                          {prop.currency} {prop.price.toLocaleString('es-AR')}
                        </td>
                        <td className="p-4">
                          {prop.active ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Activo</span>
                          ) : (
                            <span className="text-neutral-500 font-semibold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Inactivo</span>
                          )}
                        </td>
                        {/* ARGENPROP SYNC STATE */}
                        <td className="p-4 text-center">
                          {prop.syncState?.argenpropStatus === 'ACTIVE' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-950/20 text-emerald-400 font-semibold text-[9px] tracking-wider uppercase border border-emerald-400/20">Publicado</span>
                          ) : prop.syncState?.argenpropStatus === 'ERROR' ? (
                            <span 
                              title={prop.syncState.argenpropError}
                              className="inline-flex items-center px-2 py-1 rounded bg-red-950/20 text-red-400 font-semibold text-[9px] tracking-wider uppercase border border-red-400/20 cursor-help"
                            >
                              Error
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[10px]">-</span>
                          )}
                        </td>
                        {/* MERCADO LIBRE SYNC STATE */}
                        <td className="p-4 text-center">
                          {prop.syncState?.meliStatus === 'ACTIVE' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-950/20 text-emerald-400 font-semibold text-[9px] tracking-wider uppercase border border-emerald-400/20">Publicado</span>
                          ) : prop.syncState?.meliStatus === 'PAUSED' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-950 text-neutral-500 font-semibold text-[9px] tracking-wider uppercase border border-neutral-800">Pausado</span>
                          ) : prop.syncState?.meliStatus === 'ERROR' ? (
                            <span 
                              title={prop.syncState.meliError}
                              className="inline-flex items-center px-2 py-1 rounded bg-red-950/20 text-red-400 font-semibold text-[9px] tracking-wider uppercase border border-red-400/20 cursor-help"
                            >
                              Error
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[10px]">-</span>
                          )}
                        </td>
                        {/* ACCIONES */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleManualSync(prop.id)}
                              disabled={syncingId === prop.id}
                              className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-850 rounded text-neutral-400 hover:text-brand transition-colors disabled:opacity-45"
                              title="Forzar Sincronización Manual"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${syncingId === prop.id ? 'animate-spin text-brand' : ''}`} />
                            </button>
                            <button
                              onClick={() => openPropertyForm(prop)}
                              className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-850 rounded text-neutral-400 hover:text-white transition-colors"
                              title="Editar Propiedad"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handlePropertyDelete(prop.id)}
                              className="p-2 bg-neutral-950 hover:bg-red-950/40 border border-neutral-850 hover:border-red-500/25 rounded text-neutral-400 hover:text-red-400 transition-colors"
                              title="Eliminar Propiedad"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-neutral-500">No hay propiedades registradas en el sistema.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECCION EMPRENDIMIENTOS */}
      {activeTab === 'developments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-base font-bold uppercase tracking-wider">Proyectos de Obra</h2>
            <button
              onClick={() => openDevelopmentForm(null)}
              className="btn-brand px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Nuevo Emprendimiento
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 rounded-lg overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-850 bg-neutral-950 text-neutral-400 uppercase font-semibold tracking-wider">
                  <th className="p-4">Emprendimiento</th>
                  <th className="p-4">Ubicación</th>
                  <th className="p-4">Estado de Obra</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 text-neutral-300">
                {developments.length > 0 ? (
                  developments.map((dev) => (
                    <tr key={dev.id} className="hover:bg-neutral-950/40 transition-colors">
                      <td className="p-4 font-semibold text-white">{dev.title}</td>
                      <td className="p-4">{dev.location}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase border ${
                          dev.status === 'FINISHED'
                            ? 'bg-neutral-950 text-emerald-400 border-emerald-400/20'
                            : 'bg-brand-light text-brand border-brand/20 font-medium'
                        }`}>
                          {dev.status === 'FINISHED' ? 'Terminado' : 'En Obra'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openDevelopmentForm(dev)}
                            className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-850 rounded text-neutral-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDevelopmentDelete(dev.id)}
                            className="p-2 bg-neutral-950 hover:bg-red-950/40 border border-neutral-850 hover:border-red-500/25 rounded text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-neutral-500">No hay emprendimientos cargados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SECCION MENSAJES (BANDEJA DE ENTRADA) */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <h2 className="text-white text-base font-bold uppercase tracking-wider">Mensajes Recibidos</h2>
          
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="bg-neutral-900 border border-neutral-850 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-neutral-850 pb-3">
                    <div>
                      <h3 className="text-white font-bold text-sm">{msg.name}</h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Email: <a href={`mailto:${msg.email}`} className="text-brand hover:underline">{msg.email}</a> | Tel: {msg.phone}
                      </p>
                    </div>
                    <span className="text-[10px] text-neutral-500">{new Date(msg.createdAt).toLocaleString('es-AR')}</span>
                  </div>

                  {msg.property && (
                    <div className="bg-neutral-950 border border-neutral-850 rounded p-3 text-[11px] flex items-center justify-between">
                      <span className="text-neutral-400">Consulta vinculada a la propiedad:</span>
                      <a href={`/propiedad/${msg.property.id}`} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold hover:underline flex items-center gap-1">
                        {msg.property.title} ({msg.property.currency} {msg.property.price.toLocaleString('es-AR')})
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-950/40 p-4 rounded border border-neutral-850/60">
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-850 rounded-lg">No se han recibido consultas a través de los formularios todavía.</p>
            )}
          </div>
        </div>
      )}

      {/* --- FORMULARIO DE PROPIEDAD MODAL --- */}
      {showPropertyForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-850 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowPropertyForm(false)} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-white font-bold text-lg"
            >
              ×
            </button>
            
            <h3 className="text-white font-bold text-base tracking-widest uppercase border-b border-neutral-800 pb-3">
              {selectedProperty ? 'Editar Propiedad' : 'Cargar Nueva Propiedad'}
            </h3>

            {errorPropertyForm && (
              <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded p-4">
                {errorPropertyForm}
              </div>
            )}

            <form onSubmit={handlePropertySubmit} className="space-y-6 text-xs text-neutral-300">
              {/* FILA 1: TITULO */}
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Título de la Publicación</label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white"
                  placeholder="Ej: Semipiso 4 Ambientes con Cochera en Recoleta"
                />
              </div>

              {/* FILA 2: CATEGORIA, OPERACION, MONEDA, PRECIO */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Tipo de Inmueble</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white cursor-pointer"
                  >
                    <option value="CASA">Casa</option>
                    <option value="DEPARTAMENTO">Departamento</option>
                    <option value="PH">PH</option>
                    <option value="LOTE">Lote</option>
                    <option value="LOCAL">Local</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Operación</label>
                  <select
                    value={propOperation}
                    onChange={(e) => setPropOperation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white cursor-pointer"
                  >
                    <option value="VENTA">Venta</option>
                    <option value="ALQUILER">Alquiler</option>
                    <option value="ALQUILER_TEMPORARIO">Alquiler Temporario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Moneda</label>
                  <select
                    value={propCurrency}
                    onChange={(e) => setPropCurrency(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white cursor-pointer"
                  >
                    <option value="USD">USD (Dólares)</option>
                    <option value="ARS">ARS (Pesos)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Precio</label>
                  <input
                    type="number"
                    required
                    value={propPrice}
                    onChange={(e) => setPropPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white"
                    placeholder="Ej: 350000"
                  />
                </div>
              </div>

              {/* FILA 3: SUPERFICIES Y AMBIENTES */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Sup. Total (m²)</label>
                  <input
                    type="number"
                    required
                    value={propTotalArea}
                    onChange={(e) => setPropTotalArea(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Sup. Cub. (m²)</label>
                  <input
                    type="number"
                    required
                    value={propCoveredArea}
                    onChange={(e) => setPropCoveredArea(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Ambientes</label>
                  <input
                    type="number"
                    value={propRooms}
                    onChange={(e) => setPropRooms(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Dormitorios</label>
                  <input
                    type="number"
                    value={propBedrooms}
                    onChange={(e) => setPropBedrooms(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Baños</label>
                  <input
                    type="number"
                    value={propBathrooms}
                    onChange={(e) => setPropBathrooms(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white"
                  />
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Cochera</label>
                  <input
                    type="checkbox"
                    checked={propGarage}
                    onChange={(e) => setPropGarage(e.target.checked)}
                    className="w-5 h-5 accent-[#e06a8f] cursor-pointer"
                  />
                </div>
              </div>

              {/* FILA 4: UBICACION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Dirección</label>
                  <input
                    type="text"
                    required
                    value={propAddress}
                    onChange={(e) => setPropAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white"
                    placeholder="Ej: Av. del Libertador 2200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Barrio / Zona</label>
                  <input
                    type="text"
                    required
                    value={propNeighborhood}
                    onChange={(e) => setPropNeighborhood(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white"
                    placeholder="Ej: Recoleta, CABA"
                  />
                </div>
              </div>

              {/* DESCRIPCION */}
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Descripción Detallada</label>
                <textarea
                  required
                  rows="5"
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white resize-none"
                  placeholder="Detalles sobre el inmueble, terminaciones, amenities, etc."
                />
              </div>

              {/* IMAGENES */}
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">URLs de las Fotos (Separadas por coma)</label>
                <textarea
                  rows="3"
                  value={propImagesText}
                  onChange={(e) => setPropImagesText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white resize-none"
                  placeholder="Pegue las URLs de las imágenes separadas por coma..."
                />
              </div>

              {/* OPCIONES ADICIONALES */}
              <div className="flex gap-8 border-t border-neutral-850 pt-4">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-[10px]">
                  <input
                    type="checkbox"
                    checked={propFeatured}
                    onChange={(e) => setPropFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#e06a8f] cursor-pointer"
                  />
                  Destacada (Home)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-[10px]">
                  <input
                    type="checkbox"
                    checked={propActive}
                    onChange={(e) => setPropActive(e.target.checked)}
                    className="w-4 h-4 accent-[#e06a8f] cursor-pointer"
                  />
                  Publicada / Activa
                </label>
              </div>

              <div className="flex gap-4 border-t border-neutral-850 pt-6 mt-6">
                <button
                  type="submit"
                  className="btn-brand px-6 py-3.5 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Guardar Propiedad
                </button>
                <button
                  type="button"
                  onClick={() => setShowPropertyForm(false)}
                  className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 px-6 py-3.5 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FORMULARIO DE EMPRENDIMIENTO MODAL --- */}
      {showDevelopmentForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-850 rounded-lg w-full max-w-2xl p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowDevelopmentForm(false)} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-white font-bold text-lg"
            >
              ×
            </button>
            
            <h3 className="text-white font-bold text-base tracking-widest uppercase border-b border-neutral-800 pb-3">
              {selectedDevelopment ? 'Editar Emprendimiento' : 'Nuevo Emprendimiento'}
            </h3>

            <form onSubmit={handleDevelopmentSubmit} className="space-y-6 text-xs text-neutral-300">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  value={devTitle}
                  onChange={(e) => setDevTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white"
                  placeholder="Ej: Torres del Yacht Premium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Ubicación</label>
                  <input
                    type="text"
                    required
                    value={devLocation}
                    onChange={(e) => setDevLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white"
                    placeholder="Ej: Juana Manso 1500, Puerto Madero"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Estado de Obra</label>
                  <select
                    value={devStatus}
                    onChange={(e) => setDevStatus(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-3 text-white cursor-pointer"
                  >
                    <option value="CONSTRUCTION">En Construcción</option>
                    <option value="FINISHED">Terminado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Descripción General</label>
                <textarea
                  required
                  rows="4"
                  value={devDescription}
                  onChange={(e) => setDevDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white resize-none"
                  placeholder="Detalles sobre el fideicomiso, cuotas, amenities, etc."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">URLs de las Fotos</label>
                <textarea
                  rows="2"
                  value={devImagesText}
                  onChange={(e) => setDevImagesText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white resize-none"
                  placeholder="URLs separadas por comas..."
                />
              </div>

              <div className="flex gap-4 border-t border-neutral-850 pt-6 mt-6">
                <button
                  type="submit"
                  className="btn-brand px-6 py-3.5 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Guardar Proyecto
                </button>
                <button
                  type="button"
                  onClick={() => setShowDevelopmentForm(false)}
                  className="bg-neutral-950 border border-neutral-850 text-neutral-300 px-6 py-3.5 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-500">Cargando panel...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
