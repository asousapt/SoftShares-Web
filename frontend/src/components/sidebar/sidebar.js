import React, { useState } from "react";
import SubMenu from "./subMenu";
import SidebarData from "./SidebarData";
import { IconContext } from "react-icons/lib";
import './sidebar.css';

const Sidebar = () => {
    return (
        <>
            <IconContext.Provider value={{ color: "#fff" }}>
                <nav className="SidebarNav">
                    <div className="SidebarWrap">
                        <div className="regiao">
                            Viseu
                        </div>
                        <div className="bemvindo">
                            Bem-vindo
                        </div>
                        <div className="User">
                            @user
                        </div>x
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