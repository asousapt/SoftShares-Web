import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link, useLocation } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import './sidebar.css';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";

const Sidebar = () => {
    const location = useLocation();
    const [openSections, setOpenSections] = useState({
        estatisticas: false,
        listagem: false,
        moderacao: false,
        configuracao: false,
    });

    const [hoveredItems, setHoveredItems] = useState({});
    const [selectedItem, setSelectedItem] = useState(location.pathname);

    useEffect(() => {
        setSelectedItem(location.pathname);
    }, [location.pathname]);

    const handleToggle = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleHover = (item, isHovered) => {
        setHoveredItems((prev) => ({ ...prev, [item]: isHovered }));
    };

    const menuItems = [
        { title: 'Dashboard', icon: AiIcons.AiFillHome, link: '/dashboard' },
        { 
            title: 'Estatísticas', 
            icon: FaIcons.FaChartBar, 
            subItems: [
                { title: 'Utilizadores', link: '/estatisticas/utilizadores', icon: IoIcons.IoIosPaper },
                { title: 'Denuncias', link: '/estatisticas/denuncias', icon: IoIcons.IoIosPaper },
                { title: 'Reporting', link: '/estatisticas/reporting', icon: IoIcons.IoIosPaper },
            ],
        },
        { 
            title: 'Listagem', 
            icon: FaIcons.FaClipboardList, 
            subItems: [
                { title: 'Eventos', link: '/lista/eventos', icon: IoIcons.IoIosPaper },
                { title: 'Pontos de Interesse', link: '/lista/pontosinteresse', icon: IoIcons.IoIosPaper },
                { title: 'Publicações', link: '/lista/publicacoes', icon: IoIcons.IoIosPaper },
            ],
        },
        { 
            title: 'Moderação', 
            icon: FaIcons.FaClipboardList, 
            subItems: [
                { title: 'Aprovações', link: '/moderacao/aprovacoes', icon: IoIcons.IoIosPaper },
                { title: 'Denúncias', link: '/moderacao/denuncias', icon: IoIcons.IoIosPaper },
            ],
        },
        { 
            title: 'Configuração', 
            icon: FaIcons.FaClipboardList, 
            subItems: [
                { title: 'Polos', link: '/config/polos', icon: IoIcons.IoIosPaper },
                { title: 'Formulários', link: '/config/forms', icon: IoIcons.IoIosPaper },
                { title: 'Utilizadores', link: '/config/utilizadores', icon: MdIcons.MdOutlineManageAccounts },
                { title: 'Departamentos', link: '/config/departamentos', icon: MdIcons.MdOutlineManageAccounts },
                { title: 'Funções', link: '/config/funcoes', icon: IoIcons.IoIosPaper },
                { title: 'Categorias', link: '/config/categorias', icon: IoIcons.IoIosPaper },
                { title: 'Subcategorias', link: '/config/subcategorias', icon: IoIcons.IoIosPaper },
                { title: 'Alertas', link: '/config/alertas', icon: IoIcons.IoIosPaper },
            ],
        },
    ];

    const getItemBackgroundColor = (itemLink) => {
        return selectedItem === itemLink ? 'rgba(128, 128, 128, 0.3)' : "white";
    };

    const getItemColor = (itemLink, itemTitle) => {
        return selectedItem === itemLink ? 'white' : (hoveredItems[itemTitle] ? 'rgba(77, 156, 250, 1)' : 'black');
    };

    return (
        <Drawer variant="permanent" sx={{ "& .MuiPaper-root": { borderRight: "none" } }}>
            <List style={{ width: '250px', backgroundColor: 'rgba(42, 67, 97, 1)', height: '100%', overflowY: 'scroll' }}>
                <div className="regiao">@Polo</div>
                <div className="bemvindo">Bem-vindo</div>
                <div className="User">@user</div>

                {menuItems.map((item, index) => (
                    <div key={index}>
                        <ListItem 
                            component={item.link ? Link : 'div'} 
                            to={item.link || '#'} 
                            onClick={() => {
                                if (item.subItems) {
                                    handleToggle(item.title.toLowerCase());
                                } else {
                                    setSelectedItem(item.link);
                                }
                            }}
                            style={{ 
                                backgroundColor: getItemBackgroundColor(item.link),
                                borderRadius: '12px', 
                                marginBottom: '5px', 
                                marginLeft: '5px', 
                                width: '240px', 
                                color: getItemColor(item.link, item.title) 
                            }}
                            onMouseOver={() => handleHover(item.title, true)}
                            onMouseOut={() => handleHover(item.title, false)}
                        >
                            <ListItemIcon>
                                <item.icon 
                                    style={{ 
                                        color: getItemColor(item.link, item.title)
                                    }}
                                    onMouseOver={() => handleHover(item.title, true)}
                                    onMouseOut={() => handleHover(item.title, false)} 
                                />
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                            {item.subItems && (openSections[item.title.toLowerCase()] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItem>
                        
                        {item.subItems && (
                            <Collapse in={openSections[item.title.toLowerCase()]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <ListItem 
                                            key={subIndex} 
                                            component={Link} 
                                            to={subItem.link} 
                                            style={{ 
                                                backgroundColor: getItemBackgroundColor(subItem.link),
                                                borderRadius: '12px', 
                                                marginBottom: '5px', 
                                                marginLeft: '30px', 
                                                width: '215px', 
                                                color: getItemColor(subItem.link, subItem.title)
                                            }}
                                            onMouseOver={() => handleHover(subItem.title, true)}
                                            onMouseOut={() => handleHover(subItem.title, false)}
                                            onClick={() => setSelectedItem(subItem.link)}
                                        >
                                            <ListItemIcon>
                                                <subItem.icon 
                                                    style={{ 
                                                        color: getItemColor(subItem.link, subItem.title)
                                                    }}
                                                    onMouseOver={() => handleHover(subItem.title, true)}
                                                    onMouseOut={() => handleHover(subItem.title, false)} 
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={subItem.title} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </div>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
