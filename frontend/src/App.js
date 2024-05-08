import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ListaEventos from './pages/listaEventos'
import ListaPontosInt from './pages/listaPontosInt'
import ListaPublicacoes from './pages/listaPublicacoes'
import ModAprov from './pages/modAprov'
import ModDen from './pages/modDen'

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
                        <Route path="/lista/eventos" element={<ListaEventos />} />
                        <Route path="/lista/pontosinteresse" element={<ListaPontosInt />} />
                        <Route path="/lista/publicacoes" element={<ListaPublicacoes />} />
                        <Route path="/moderacao/aprovacoes" element={<ModAprov />} />
                        <Route path="/moderacao/denuncias" element={<ModDen />} />
                    </Routes>
                </div>
            </div>
        </Router> 
    );
}
 
export default App;
