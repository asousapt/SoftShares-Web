import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import ListaEventos from './pages/listaEventos';
import ListaPontosInt from './pages/listaPontosInt';
import ListaPublicacoes from './pages/listaPublicacoes';
import ModAprov from './pages/modAprovacoes';
import ModDen from './pages/modDenuncias';
import ConfigPolos from './pages/configPolos';
import ConfigForms from './pages/configForms';
import ConfigUtilizadores from './pages/configUtilizadores';
import ConfigDepartamentos from './pages/configDepartamentos';
import ConfigFuncoes from './pages/configFuncoes';
import ConfigCategorias from './pages/configCategorias';
import ConfigSubcategorias from './pages/configSubcategorias';
import ConfigAlertas from './pages/configAlertas';
import Dashboard from './pages/dashboard';
import StatsUtilizador from './pages/estatisticasUtilizadores';
import StatsDenuncias from './pages/estatisticasDenuncias';
import Forms from './pages/forms';
import LandingPage from './pages/landingPage';

function AppContent() {
    const location = useLocation();
    const showSidebar = location.pathname !== "/";

    return (
        <div className="app-container">
            {showSidebar && (
                <div className="sidebar-container">
                    <Sidebar />
                </div>
            )}
            <div className="content-container" style={{ marginLeft: location.pathname === '/' ? 0 : '250px', marginRight: location.pathname === '/' ? 0 : '1%' }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/estatisticas/utilizadores" element={<StatsUtilizador />} />
                    <Route path="/estatisticas/denuncias" element={<StatsDenuncias />} />
                    <Route path="/lista/eventos" element={<ListaEventos />} />
                    <Route path="/lista/pontosinteresse" element={<ListaPontosInt />} />
                    <Route path="/lista/publicacoes" element={<ListaPublicacoes />} />
                    <Route path="/moderacao/aprovacoes" element={<ModAprov />} />
                    <Route path="/moderacao/denuncias" element={<ModDen />} />
                    <Route path="/config/polos" element={<ConfigPolos />} />
                    <Route path="/config/forms" element={<ConfigForms />} />
                    <Route path="/config/utilizadores" element={<ConfigUtilizadores />} />
                    <Route path="/config/departamentos" element={<ConfigDepartamentos />} />
                    <Route path="/config/funcoes" element={<ConfigFuncoes />} />
                    <Route path="/config/categorias" element={<ConfigCategorias />} />
                    <Route path="/config/subcategorias" element={<ConfigSubcategorias />} />
                    <Route path="/config/alertas" element={<ConfigAlertas />} />
                    <Route path="/forms" element={<Forms />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
