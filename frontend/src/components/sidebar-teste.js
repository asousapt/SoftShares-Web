import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import './sidebar-teste.css';
import { IconContext } from "react-icons/lib";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as FrIcons from "react-icons/gr";
import * as MdIcons from "react-icons/md";
import * as LuIcons from "react-icons/lu";

const Sidebar = () => {
    return (
        <>
            <IconContext.Provider value={{ color: "#ffffff" }}>
                <nav className="SidebarNav">
                    <div className="SidebarWrap">
                        <div className="regiao"> Viseu </div>
                        <div className="bemvindo"> Bem-vindo </div>
                        <div className="User"> @user </div>
                        
                        <ProSidebar
                            rootStyles={{
                                [`.${sidebarClasses.container}`]: {
                                    backgroundColor: 'transparent',
                                    width: '100%',
                                    height: '100%'
                                },
                            }}
                        >
                            <Menu 
                                menuItemStyles={{
                                    button: ({ level }) => ({
                                        backgroundColor: level === 0 ? 'white' : 'red', 
                                        borderRadius: '12px',
                                        marginBottom: '5px'
                                    }),
                                    submenu: { 
                                        backgroundColor: 'transparent', 
                                        marginLeft: '10px', 
                                        marginRight: '10px', 
                                    },
                                }}
                            style={{ marginLeft: '10px', marginRight: '10px' }} >
                                <MenuItem icon={<AiIcons.AiFillHome color='black'/>}> Dashboard </MenuItem>
                                <SubMenu label="Estatísticas" icon={<FaIcons.FaChartBar color='black'/>}>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Utilizadores </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Denúncias </MenuItem>
                                </SubMenu>
                                <SubMenu label="Listagem" icon={<FaIcons.FaClipboardList color='black'/>}>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Eventos </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Pontos de Interesse </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Publicações </MenuItem>
                                </SubMenu>
                                <SubMenu label="Moderação" icon={<LuIcons.LuShieldAlert color='black'/>}>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Aprovações </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Denúncias </MenuItem>
                                </SubMenu>
                                <SubMenu label="Configuração" icon={<FrIcons.GrConfigure color='black'/>}>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Polos </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Formulários </MenuItem>
                                    <MenuItem icon={<MdIcons.MdOutlineManageAccounts color='black'/>}> Utilizadores </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Categorias </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Subcategorias </MenuItem>
                                    <MenuItem icon={<IoIcons.IoIosPaper color='black'/>}> Alertas </MenuItem>
                                </SubMenu>

                                {/* Exemplo links
                                <MenuItem component={<Link to="/documentation" />}> Documentation</MenuItem>
                                <MenuItem component={<Link to="/calendar" />}> Calendar</MenuItem>
                                <MenuItem component={<Link to="/e-commerce" />}> E-commerce</MenuItem> */}
                            </Menu>
                        </ProSidebar>
                    </div>
                </nav>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;
