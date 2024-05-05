import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ListaEventos from './pages/listaEventos' 

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
                        {/* <Route path="/produtos" element={<ListProdutos />} /> */}
                    </Routes>
                </div>
            </div>
        </Router> 
    );
}
 
export default App;
