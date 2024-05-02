import "./App.css";
// import Sidebar from "./components/sidebar/sidebar";
import SidebarTeste from "./components/sidebar-teste";
import Table from "./components/table/table";
import {
    BrowserRouter as Router,
} from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="sidebar-container">
                    <SidebarTeste />
                </div>
                <div className="table-container">
                    <Table />
                </div>
            </div>
        </Router> 
    );
}
 
export default App;
