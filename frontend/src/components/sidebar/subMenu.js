import React, { useState } from "react";
import { Link } from "react-router-dom";
import './sidebar.css';

const SubMenu = ({ item }) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <Link
                to={item.path}
                onClick={item.subNav && showSubnav}
                className={`sidebar-link ${subnav ? 'sidebar-link-open' : ''}`}
            >
                <div>
                    {item.icon}
                    <span className={`sidebar-label ${subnav ? 'submenu-open' : ''}`}>{item.title}</span>
                </div>
                <div>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                        ? item.iconClosed
                        : null}
                </div>
            </Link>
            {subnav &&
                item.subNav.map((item, index) => {
                    return (
                        <Link
                            to={item.path}
                            key={index}
                            className="dropdown-link"
                        >
                            {item.icon}
                            <span className="sidebar-label">{item.title}</span>
                        </Link>
                    );
                })}
        </>
    );
};

export default SubMenu;
