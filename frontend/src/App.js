import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="sidebar-container">
                    <Sidebar />
                </div>

                <Routes>
                    {/* <Route path="/" element={<Navigate replace to="/dashboard" />} />
                    <Route path="/lojas" element={<ListLojas />} />
                    <Route path="/produtos" element={<ListProdutos />} /> */}
                </Routes>
            </div>
        </Router> 
    );
}
 
export default App;
