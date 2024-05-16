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
    const [isHoveredD, setIsHoveredD] = useState(false);
    const [isHoveredE, setIsHoveredE] = useState(false);
    const [isHoveredEU, setIsHoveredEU] = useState(false);
    const [isHoveredED, setIsHoveredED] = useState(false);
    const [isHoveredL, setIsHoveredL] = useState(false);
    const [isHoveredLE, setIsHoveredLE] = useState(false);
    const [isHoveredLPI, setIsHoveredLPI] = useState(false);
    const [isHoveredLP, setIsHoveredLP] = useState(false);
    const [isHoveredM, setIsHoveredM] = useState(false);
    const [isHoveredMA, setIsHoveredMA] = useState(false);
    const [isHoveredMD, setIsHoveredMD] = useState(false);
    const [isHoveredC, setIsHoveredC] = useState(false);
    const [isHoveredCP, setIsHoveredCP] = useState(false);
    const [isHoveredCF, setIsHoveredCF] = useState(false);
    const [isHoveredCU, setIsHoveredCU] = useState(false);
    const [isHoveredCD, setIsHoveredCD] = useState(false);
    const [isHoveredCFUN, setIsHoveredCFUN] = useState(false);
    const [isHoveredCC, setIsHoveredCC] = useState(false);
    const [isHoveredCS, setIsHoveredCS] = useState(false);
    const [isHoveredCA, setIsHoveredCA] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClickE = () => {
        setOpenEstatisticas(!openE);
        setSelectedItem('estatisticas');
    };

    const handleClickL = () => {
        setOpenListagem(!openL);
        setSelectedItem('listagem');
    };

    const handleClickM = () => {
        setOpenModeracao(!openM);
        setSelectedItem('moderacao');
    };

    const handleClickC = () => {
        setOpenConfiguracao(!openC);
        setSelectedItem('configuracao');
    };

    return (
        <Drawer variant="permanent" sx={{ "& .MuiPaper-root": { borderRight: "none", } }}>
            <List style={{ width: '250px', backgroundColor: 'rgba(42, 67, 97, 1)', height: '100%', overflowY: 'scroll' }}>
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
                <ListItem component={Link} to="/dashboard" style={{
                    backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px',
                    color: isHoveredD ? 'rgba(77, 156, 250, 1)' : 'black'
                }}
                    onMouseOver={() => { setIsHoveredD(true) }}
                    onMouseOut={() => { setIsHoveredD(false) }}>
                    <ListItemIcon>
                        <AiIcons.AiFillHome style={{
                            color: isHoveredD ? 'rgba(77, 156, 250, 1)' : 'black'
                        }}
                            onMouseOver={() => { setIsHoveredD(true) }}
                            onMouseOut={() => { setIsHoveredD(false) }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>

                {/* Estatisticas */}
                <ListItem onClick={handleClickE} style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: isHoveredE ? 'rgba(77, 156, 250, 1)' : 'black' }}
                    onMouseOver={() => setIsHoveredE(true)}
                    onMouseOut={() => setIsHoveredE(false)} >
                    <ListItemIcon>
                        <FaIcons.FaChartBar style={{ color: isHoveredE ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => setIsHoveredE(true)} onMouseOut={() => setIsHoveredE(false)} />
                    </ListItemIcon>
                    <ListItemText primary="Estatísticas" />
                    {openE ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={openE} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem component={Link} to="/estatisticas/utilizadores" style={{
                                backgroundColor: selectedItem === 'Utilizadores' ? 'rgba(128, 128, 128, 0.3)' : "white",
                                borderRadius: '12px',
                                marginBottom: '5px',
                                marginLeft: '30px',
                                width: '215px',
                                color: selectedItem === 'Utilizadores' || isHoveredEU ? 'rgba(77, 156, 250, 1)' : 'black' }}
                            onMouseOver={() => setIsHoveredEU(true)}
                            onMouseOut={() => setIsHoveredEU(false)}
                            onClick={() => setSelectedItem('Utilizadores')} >
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ 
                                        color: selectedItem === 'Utilizadores' || isHoveredEU ? 'rgba(77, 156, 250, 1)' : 'black' }}
                                    onMouseOver={() => setIsHoveredEU(true)}
                                    onMouseOut={() => setIsHoveredEU(false)} />
                            </ListItemIcon>
                            <ListItemText primary="Utilizadores" style={{ color: selectedItem === 'Utilizadores' || isHoveredEU ? 'rgba(77, 156, 250, 1)' : 'black' }} />
                        </ListItem>

                        <ListItem component={Link} to="/estatisticas/denuncias" style={{ backgroundColor: selectedItem === 'Denúncias' ? 'rgba(128, 128, 128, 0.3)' : "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px' }}
                            onMouseOver={() => setIsHoveredED(true)}
                            onMouseOut={() => setIsHoveredED(false)}
                            onClick={() => setSelectedItem('Denúncias')} >
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: selectedItem === 'Denúncias' || isHoveredED ? 'rgba(77, 156, 250, 1)' : 'black' }}
                                    onMouseOver={() => setIsHoveredED(true)}
                                    onMouseOut={() => setIsHoveredED(false)} />
                            </ListItemIcon>
                            <ListItemText primary="Denúncias" style={{ color: selectedItem === 'Denúncias' || isHoveredED ? 'rgba(77, 156, 250, 1)' : 'black' }}/>
                        </ListItem>
                    </List>
                </Collapse>

                {/* Listagem */}
                <ListItem onClick={handleClickL} style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: isHoveredL ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredL(true) }} onMouseOut={() => { setIsHoveredL(false) }} >
                    <ListItemIcon>
                        <FaIcons.FaClipboardList style={{ color: isHoveredL ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredL(true) }} onMouseOut={() => { setIsHoveredL(false) }} />
                    </ListItemIcon>
                    <ListItemText primary="Listagem" />
                    {openL ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openL} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem component={Link} to="/lista/eventos" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredLE ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredLE(true) }} onMouseOut={() => { setIsHoveredLE(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredLE ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredLE(true) }} onMouseOut={() => { setIsHoveredLE(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Eventos" />
                        </ListItem>
                        <ListItem component={Link} to="/lista/pontosinteresse" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredLPI ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredLPI(true) }} onMouseOut={() => { setIsHoveredLPI(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredLPI ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredLPI(true) }} onMouseOut={() => { setIsHoveredLPI(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Pontos de Interesse" />
                        </ListItem>
                        <ListItem component={Link} to="/lista/publicacoes" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredLP ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredLP(true) }} onMouseOut={() => { setIsHoveredLP(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredLP ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredLP(true) }} onMouseOut={() => { setIsHoveredLP(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Publicações" />
                        </ListItem>
                    </List>
                </Collapse>

                {/* Moderação */}
                <ListItem onClick={handleClickM} style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: isHoveredM ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredM(true) }} onMouseOut={() => { setIsHoveredM(false) }}>
                    <ListItemIcon>
                        <FaIcons.FaClipboardList style={{ color: isHoveredM ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredM(true) }} onMouseOut={() => { setIsHoveredM(false) }} />
                    </ListItemIcon>
                    <ListItemText primary="Moderação" />
                    {openM ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openM} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem component={Link} to="/moderacao/aprovacoes" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredMA ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredMA(true) }} onMouseOut={() => { setIsHoveredMA(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredMA ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredMA(true) }} onMouseOut={() => { setIsHoveredMA(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Aprovações" />
                        </ListItem>
                        <ListItem component={Link} to="/moderacao/denuncias" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredMD ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredMD(true) }} onMouseOut={() => { setIsHoveredMD(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredMD ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredMD(true) }} onMouseOut={() => { setIsHoveredMD(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Denúncias" />
                        </ListItem>
                    </List>
                </Collapse>

                {/* Configuração */}
                <ListItem onClick={handleClickC} style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '5px', width: '240px', color: isHoveredC ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredC(true) }} onMouseOut={() => { setIsHoveredC(false) }}>
                    <ListItemIcon>
                        <FaIcons.FaClipboardList style={{ color: isHoveredC ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredC(true) }} onMouseOut={() => { setIsHoveredC(false) }} />
                    </ListItemIcon>
                    <ListItemText primary="Configuração" />
                    {openC ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openC} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem component={Link} to="/config/polos" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCP ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCP(true) }} onMouseOut={() => { setIsHoveredCP(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredCP ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCP(true) }} onMouseOut={() => { setIsHoveredCP(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Polos" />
                        </ListItem>
                        <ListItem component={Link} to="/config/forms" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCF ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCF(true) }} onMouseOut={() => { setIsHoveredCF(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredCF ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCF(true) }} onMouseOut={() => { setIsHoveredCF(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Formulários" />
                        </ListItem>
                        <ListItem component={Link} to="/config/utilizadores" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCU ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCU(true) }} onMouseOut={() => { setIsHoveredCU(false) }}>
                            <ListItemIcon>
                                <MdIcons.MdOutlineManageAccounts style={{ color: isHoveredCU ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCU(true) }} onMouseOut={() => { setIsHoveredCU(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Utilizadores" />
                        </ListItem>
                        <ListItem component={Link} to="/config/departamentos" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCD ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCD(true) }} onMouseOut={() => { setIsHoveredCD(false) }}>
                            <ListItemIcon>
                                <MdIcons.MdOutlineManageAccounts style={{ color: isHoveredCD ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCD(true) }} onMouseOut={() => { setIsHoveredCD(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Departamentos" />
                        </ListItem>
                        <ListItem component={Link} to="/config/funcoes" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCFUN ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCFUN(true) }} onMouseOut={() => { setIsHoveredCFUN(false) }}>
                            <ListItemIcon>
                                <MdIcons.MdOutlineManageAccounts style={{ color: isHoveredCFUN ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCFUN(true) }} onMouseOut={() => { setIsHoveredCFUN(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Funções" />
                        </ListItem>
                        <ListItem component={Link} to="/config/categorias" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCC ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCC(true) }} onMouseOut={() => { setIsHoveredCC(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredCC ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCC(true) }} onMouseOut={() => { setIsHoveredCC(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Categorias" />
                        </ListItem>
                        <ListItem component={Link} to="/config/subcategorias" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCS ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCS(true) }} onMouseOut={() => { setIsHoveredCS(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredCS ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCS(true) }} onMouseOut={() => { setIsHoveredCS(false) }} />
                            </ListItemIcon>
                            <ListItemText primary="Subcategorias" />
                        </ListItem>
                        <ListItem component={Link} to="/config/alertas" style={{ backgroundColor: "white", borderRadius: '12px', marginBottom: '5px', marginLeft: '30px', width: '215px', color: isHoveredCA ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCA(true) }} onMouseOut={() => { setIsHoveredCA(false) }}>
                            <ListItemIcon>
                                <IoIcons.IoIosPaper style={{ color: isHoveredCA ? 'rgba(77, 156, 250, 1)' : 'black' }} onMouseOver={() => { setIsHoveredCA(true) }} onMouseOut={() => { setIsHoveredCA(false) }} />
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