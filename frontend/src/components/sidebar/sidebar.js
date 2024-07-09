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
import { CiViewList } from "react-icons/ci";
import { AiOutlineException } from "react-icons/ai";
import { BsCalendar2Event } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";
import { AiOutlineRise } from "react-icons/ai";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { RiListCheck3 } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { LuBuilding2 } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoBriefcaseOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import { RiChatThreadLine } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";

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

    const [userName, setUserName] = useState('');
    const [userProfile, setUserProfile] = useState('');
    const [descricaoPolo, setDescricaoPolo] = useState('');

    useEffect(() => {
        const name = sessionStorage.getItem('nome');
        const profile = sessionStorage.getItem('perfil');
        const descricaoPolo = sessionStorage.getItem('descpolo');

        if (name) {
            setUserName(name);
        }
        if (profile) {
            setUserProfile(profile);
        }
        if (descricaoPolo) {
            setDescricaoPolo(descricaoPolo);
        }
    }, []);

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
                { title: 'Gerais', link: '/estatisticas/utilizadores', icon: AiOutlineRise},
                { title: 'Denuncias', link: '/estatisticas/denuncias', icon: AiOutlineException }
            ],
        },
        { 
            title: 'Listagem', 
            icon: CiViewList, 
            subItems: [
                { title: 'Eventos', link: '/lista/eventos', icon: BsCalendar2Event },
                { title: 'Pontos de Interesse', link: '/lista/pontosinteresse', icon: HiOutlineLocationMarker },
                { title: 'Publicações', link: '/lista/publicacoes', icon: RiChatThreadLine },
            ],
        },
        { 
            title: 'Moderação', 
            icon: RiListCheck3, 
            subItems: [
                { title: 'Aprovações', link: '/moderacao/aprovacoes', icon: AiOutlineCheckSquare },
                { title: 'Denúncias', link: '/moderacao/denuncias', icon: AiOutlineWarning},
            ],
        },
        { 
            title: 'Configuração', 
            icon: IoSettingsOutline, 
            subItems: userProfile === 'Admin' ? [
                { title: 'Utilizadores', link: '/config/utilizadores', icon: MdIcons.MdOutlineManageAccounts },
                { title: 'Alertas', link: '/config/alertas', icon: IoIcons.IoIosPaper },
            ] : [
                { title: 'Polos', link: '/config/polos', icon: LuBuilding2 },
                { title: 'Formulários', link: '/config/forms', icon: IoDocumentTextOutline },
                { title: 'Utilizadores', link: '/config/utilizadores', icon: MdIcons.MdOutlineManageAccounts },
                { title: 'Departamentos', link: '/config/departamentos', icon: GrGroup },
                { title: 'Funções', link: '/config/funcoes', icon: IoBriefcaseOutline },
                { title: 'Categorias', link: '/config/categorias', icon: BiCategory },
                { title: 'Subcategorias', link: '/config/subcategorias', icon: MdOutlineCategory },
                { title: 'Alertas', link: '/config/alertas', icon: FiAlertCircle },
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
                <div className="regiao">{descricaoPolo || userProfile}</div>
                <div className="bemvindo">Bem-vindo</div>
                <div className="User">{userName}</div>

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
