

import {Avatar, Divider, Listbox, ListboxItem, Tooltip} from "@heroui/react";
import React from "react";
import { Icon } from '@iconify/react';
import AsyncTechLogo from "../assets/asynctech.png";

const sidebarItems = {
  dashboard: {
    icon: "tabler:dashboard",
    title: "Dashboard"
  },
  projects: {
    icon: "tabler:check",
    title: "Projects"
  },
  customers: {
    icon: "tabler:users",
    title: "Customers"
  },
  tasks: {
    icon: "tabler:list-check",
    title: "Tasks"
  }
}

const Sidebar = () => {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const [showFullSidebar, setShowFullSidebar] = React.useState(true);

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
      );
    
    const name = (
      <div className="flex flex-col ml-3">
        <p className="text-sm">John Doe</p>
        <p className="text-xs text-gray-500">Admin</p>
      </div>
    )

    return (
      <div >
        <div className={"relative flex h-full flex-1 flex-col border-r-small border-divider h-lvh justify-between " + (showFullSidebar ? "w-72" : "w-20")}>

        <div 
          onClick={() => setShowFullSidebar(!showFullSidebar)}
          className="rounded-full w-6 h-6 border-light-grey border-1 bg-white absolute -right-3 top-6 flex items-center justify-center cursor-pointer">
            <Icon icon="icon-park-outline:left" height={15} color="grey" />
        </div>
        <div>
        <div className="p-4 flex flex-row items-center">
          <div className="p-1 bg-black rounded">
            <img src={AsyncTechLogo} width={32} />
          </div>
          {
            showFullSidebar ? <h3 className="ml-4">Async Tech LLC</h3> : null
          }
        </div>
        <Divider/>
        </div>
        
        <div className="overflow-y-scroll h-full">

        <Listbox 
          className="p-4"
          aria-label="Single selection example"
          variant="flat"
          hideSelectedIcon={true}
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
         {
            Object.keys(sidebarItems).map((item) => (
              <ListboxItem className={"p-3"} key={item}>
                <Tooltip key={item} placement="right" content={sidebarItems[item].title} offset={20} isDisabled={showFullSidebar}>
                <div className={"flex flex-row " + (!showFullSidebar ? "justify-center" : "")}>
                <Icon icon={sidebarItems[item].icon} className="flex" height={24}  />
                { showFullSidebar ? <p className="ml-2">{sidebarItems[item].title}</p> : null}
                </div>
                </Tooltip>
              </ListboxItem>
            ))
          
         }
        </Listbox>
        </div>
        <div>
        <Divider/>

        <div className="p-4 flex flex-row">
          <Tooltip key="avatar" placement="right" content={name} isDisabled={showFullSidebar}>
          <Avatar isBordered radius="full" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
          </Tooltip>
          {showFullSidebar ? name : null}
        </div>
        </div>
        </div>
        
      </div>
    );
  
  };
  export default Sidebar;