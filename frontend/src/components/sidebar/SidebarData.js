import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as FrIcons from "react-icons/gr";
import * as MdIcons from "react-icons/md";
import * as LuIcons from "react-icons/lu";
 
const sidebarData = [
    {
        title: "Dashboard",
        path: "/",
        icon: <AiIcons.AiFillHome />,
    },
    {
        title: "Estatísticas",
        path: "/",
        icon: <FaIcons.FaChartBar />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav: [
            {
                title: "Utilizadores",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
                cName: "sub-nav",
            },
            {
                title: "Denúncias",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
                cName: "sub-nav",
            }
        ],
    },
    {
        title: "Listagem",
        path: "/",
        icon: <FaIcons.FaClipboardList />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
 
        subNav: [
            {
                title: "Eventos",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Pontos de Interesse",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Publicações",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Moderação",
        path: "/",
        icon: <LuIcons.LuShieldAlert/>,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
 
        subNav: [
            {
                title: "Aprovações",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Denúncias",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Configuração",
        path: "/",
        icon: <FrIcons.GrConfigure/>,
 
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
 
        subNav: [
            {
                title: "Polos",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Formulários",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Utilizadores",
                path: "/",
                icon: <MdIcons.MdOutlineManageAccounts  />,
            },
            {
                title: "Categorias",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Subcategorias",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Alertas",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
];


export default sidebarData;
