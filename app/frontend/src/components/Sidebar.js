

import {Avatar, Divider, Listbox, ListboxItem, Tooltip, Popover, PopoverTrigger, PopoverContent} from "@heroui/react";
import React from "react";
import { Icon } from '@iconify/react';
import {useNavigate, useLocation} from "react-router-dom";
import { theaterIcon } from '../utils/branding';

const Sidebar = (props) => {
    const [showFullSidebar, setShowFullSidebar] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const theaterName = props.info && props.info.theater_name ? props.info.theater_name : "Homeflix";

    const activeKey = Object.keys(props.sidebarItems).find(
      (item) => location.pathname.startsWith(props.sidebarItems[item].path)
    );

    const name = (
      <div className="flex flex-col ml-3 min-w-0">
        <p className="text-sm truncate">{props.user.email}</p>
        <p className="text-xs text-foreground/40">Admin</p>
      </div>
    )

    return (
      <>
        {
          props.user.user_id ? (
             <div className="flex flex-row min-h-screen">
              <div className={"flex flex-col border-r border-white/10 bg-content1/50 h-screen sticky top-0 justify-between transition-all " + (showFullSidebar ? "w-72" : "w-20")}>
                <div
                  onClick={() => setShowFullSidebar(!showFullSidebar)}
                  className="rounded-full w-6 h-6 border border-white/20 bg-content2 absolute -right-3 top-6 flex items-center justify-center cursor-pointer z-20 hover:bg-content3 transition-colors"
                  >
                  <Icon icon={showFullSidebar ? "solar:alt-arrow-left-linear" : "solar:alt-arrow-right-linear"} height={14} className="text-foreground/60" />
                </div>
                <div>
                  <div className={"p-4 h-16 flex flex-row items-center gap-2 " + (!showFullSidebar ? "justify-center" : "") }>
                    <Icon icon={theaterIcon(props.info)} className="text-primary flex-shrink-0" height={26} />
                    {
                      showFullSidebar ?
                      <p className="font-marquee text-xl text-foreground tracking-wider truncate">{theaterName}</p>
                      : null
                    }
                  </div>
                  <Divider className="bg-white/10"/>
                </div>
                <div className="overflow-y-auto h-full no-scrollbar">
                  <Listbox
                    className={showFullSidebar ? "p-4" : "p-2"}
                    aria-label="Admin navigation"
                    variant="flat"
                    hideSelectedIcon={true}
                    selectionMode="none"
                  >
                  {
                      Object.keys(props.sidebarItems).map((item) => (

                        <ListboxItem
                          key={item}
                          className={"mb-1 " + (item === activeKey ? "bg-primary/15 text-primary" : "text-foreground/70")}
                          onClick={() => navigate(props.sidebarItems[item].path)}
                        >
                          <Tooltip key={item} placement="right" content={props.sidebarItems[item].title} offset={20} isDisabled={showFullSidebar}>
                          <div className={"flex flex-row items-center py-1 " + (!showFullSidebar ? "justify-center" : "")}>
                          <Icon icon={props.sidebarItems[item].icon} className="flex flex-shrink-0" height={22}  />
                          { showFullSidebar ? <p className="ml-3 text-sm font-medium">{props.sidebarItems[item].title}</p> : null}
                          </div>
                          </Tooltip>
                        </ListboxItem>
                      ))

                  }
                  </Listbox>
                </div>
                <div>
                <Divider className="bg-white/10"/>
                <div className={"p-4 flex flex-row items-center " + (!showFullSidebar ? "justify-center" : "")}>
                  <Popover key={"avatar-popover"} placement={"top-end"}>
                  <PopoverTrigger>
                  <Avatar
                    isBordered
                    radius="full"
                    size="sm"
                    name={props.user.email}
                    classNames={{base: "bg-primary/20 text-primary cursor-pointer flex-shrink-0"}}
                  />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Listbox aria-label="User actions" className="text-foreground">
                        <ListboxItem
                          key="view-site"
                          startContent={<Icon icon="solar:tv-linear" height={18} />}
                          onClick={() => navigate("/")}
                        >
                          View Site
                        </ListboxItem>
                        <ListboxItem
                          key="logout"
                          color="danger"
                          className="text-danger"
                          startContent={<Icon icon="solar:logout-2-linear" height={18} />}
                          onClick={props.logout}
                        >
                          Logout
                        </ListboxItem>
                    </Listbox>
                  </PopoverContent>
                  </Popover>
                  {showFullSidebar ? name : null}
                </div>
              </div>
            </div>
            <div className="w-full min-w-0">
            {props.children}
            </div>
          </div>
        ):
        <div>{props.children}</div>
        }
      </>
    );

  };
  export default Sidebar;
