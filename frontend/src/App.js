import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ListaEventos from './pages/listaEventos'
import ListaPontosInt from './pages/listaPontosInt'
import ListaPublicacoes from './pages/listaPublicacoes'
import ModAprov from './pages/modAprovacoes'
import ModDen from './pages/modDenuncias'
import ListaPolos from './pages/listaPolos'
import ListaForms from './pages/listaForms'
import ListaUtilizadores from './pages/listaUtilizadores'
import ListaCategorias from './pages/listaCategorias'
import ListaSubcategorias from './pages/listaSubcategorias'
import ListaAlertas from './pages/listaAlertas'

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/dashboard" />} />
                        <Route path="/dashboard" element={<ListaEventos />} />
                        <Route path="/estatisticas/utilizadores" element={<ListaEventos />} />
                        <Route path="/estatisticas/denuncias" element={<ListaEventos />} />
                        <Route path="/lista/eventos" element={<ListaEventos />} />
                        <Route path="/lista/pontosinteresse" element={<ListaPontosInt />} />
                        <Route path="/lista/publicacoes" element={<ListaPublicacoes />} />
                        <Route path="/moderacao/aprovacoes" element={<ModAprov />} />
                        <Route path="/moderacao/denuncias" element={<ModDen />} />
                        <Route path="/config/polos" element={<ListaPolos />} />
                        <Route path="/config/forms" element={<ListaForms />} />
                        <Route path="/config/utilizadores" element={<ListaUtilizadores />} />
                        <Route path="/config/categorias" element={<ListaCategorias />} />
                        <Route path="/config/subcategorias" element={<ListaSubcategorias />} />
                        <Route path="/config/alertas" element={<ListaAlertas />} />
                    </Routes>
                </div>
            </div>
        </Router> 
    );
}
 
export default App;
