import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
 
const sidebarData = [
    {
        title: "About Us",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
 
        subNav: [
            {
                title: "Our Aim",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Our Vision",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Services",
        path: "/",
        icon: <IoIcons.IoIosPaper />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
 
        subNav: [
            {
                title: "Service 1",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
                cName: "sub-nav",
            },
            {
                title: "Service 2",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
                cName: "sub-nav",
            },
            {
                title: "Service 3",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Contact",
        path: "/",
        icon: <FaIcons.FaPhone />,
    },
    {
        title: "Events",
        path: "/",
        icon: <FaIcons.FaEnvelopeOpenText />,
 
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
 
        subNav: [
            {
                title: "Event 1",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Event 2",
                path: "/",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Support",
        path: "/",
        icon: <IoIcons.IoMdHelpCircle />,
    },
];


export default sidebarData;
