import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { IconContext } from "react-icons/lib";
import './sidebar.css';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as FrIcons from "react-icons/gr";
import * as MdIcons from "react-icons/md";
import * as LuIcons from "react-icons/lu";

const Sidebar = () => {
  const [openE, setOpenEstatisticas] = useState(false);
  const [openL, setOpenListagem] = useState(false);
  const [openM, setOpenModeracao] = useState(false);
  const [openC, setOpenConfiguracao] = useState(false);

  const handleClickE = () => {
    setOpenEstatisticas(!openE);
  };

  const handleClickL = () => {
    setOpenListagem(!openL);
  };

  const handleClickM = () => {
    setOpenModeracao(!openM);
  };

  const handleClickC = () => {
    setOpenConfiguracao(!openC);
  };
  
  return (
    <Drawer variant="permanent" sx={{"& .MuiPaper-root": { borderRight: "none", } }}>
        <List style={{width: '250px', backgroundColor: 'rgba(42, 67, 97, 1)', height: '100%', overflowY: 'scroll'}}>
            <div className="regiao">
                @Polo
            </div>
            <div className="bemvindo">
                Bem-vindo
            </div>
            <div className="User">
                @user
            </div>

            {/* Dashboard */}
            <ListItem component={Link} to="/dashboard" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: 'black'}}>
                <ListItemIcon>
                    <AiIcons.AiFillHome color='black'/>
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            
            {/* Estatisticas */}
            <ListItem onClick={handleClickE} style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: 'black'}}>
                <ListItemIcon>
                    <FaIcons.FaChartBar color='black'/>
                </ListItemIcon>
                <ListItemText primary="Estatísticas" />
                {openE ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openE} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem component={Link} to="/estatisticas/utilizadores" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Utilizadores" />
                    </ListItem>
                    <ListItem component={Link} to="/estatisticas/denuncias" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Denúncias" />
                    </ListItem>
                </List>
            </Collapse>
            
            {/* Listagem */}
            <ListItem onClick={handleClickL} style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: 'black'}}>
                <ListItemIcon>
                    <FaIcons.FaClipboardList color='black'/>
                </ListItemIcon>
                <ListItemText primary="Listagem" />
                {openL ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openL} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem component={Link} to="/lista/eventos" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Eventos" />
                    </ListItem>
                    <ListItem component={Link} to="/lista/pontosinteresse" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Pontos de Interesse" />
                    </ListItem>
                    <ListItem component={Link} to="/lista/publicacoes" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Publicações" />
                    </ListItem>
                </List>
            </Collapse>

            {/* Moderação */}
            <ListItem onClick={handleClickM} style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: 'black'}}>
                <ListItemIcon>
                    <FaIcons.FaClipboardList color='black'/>
                </ListItemIcon>
                <ListItemText primary="Moderação" />
                {openM ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openM} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem component={Link} to="/moderacao/aprovacoes" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Aprovações" />
                    </ListItem>
                    <ListItem component={Link} to="/moderacao/denuncias" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Denúncias" />
                    </ListItem>
                </List>
            </Collapse>

            {/* Configuração */}
            <ListItem onClick={handleClickC} style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: 'black'}}>
                <ListItemIcon>
                    <FaIcons.FaClipboardList color='black'/>
                </ListItemIcon>
                <ListItemText primary="Configuração" />
                {openC ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openC} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem component={Link} to="/config/polos" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Polos" />
                    </ListItem>
                    <ListItem component={Link} to="/config/forms" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Formulários" />
                    </ListItem>
                    <ListItem component={Link} to="/config/utilizadores" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <MdIcons.MdOutlineManageAccounts color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Utilizadores" />
                    </ListItem>
                    <ListItem component={Link} to="/config/categorias" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Categorias" />
                    </ListItem>
                    <ListItem component={Link} to="/config/subcategorias" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Subcategorias" />
                    </ListItem>
                    <ListItem component={Link} to="/config/alertas" style={{backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: 'black'}}>
                        <ListItemIcon>
                            <IoIcons.IoIosPaper color='black'/>
                        </ListItemIcon>
                        <ListItemText primary="Alertas" />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    </Drawer>
  );
};

export default Sidebar;