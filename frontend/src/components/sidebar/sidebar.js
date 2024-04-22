import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import SubMenu from "./subMenu";
import SidebarData from "./SidebarData";
import { IconContext } from "react-icons/lib";
import './sidebar.css';
 
const Sidebar = () => {
    return (
        <>
            <IconContext.Provider value={{ color: "#fff" }}>
                <nav className="SidebarNav active">
                    <div className="SidebarWrap">
                        <div>
                            <p>sadas</p>
                            <p>sadas</p>
                            <p>sadas</p>
                        </div>
                        {SidebarData.map((item, index) => {
                            return (
                                <SubMenu
                                    item={item}
                                    key={index}
                                />
                            );
                        })}
                    </div>
                </nav>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;