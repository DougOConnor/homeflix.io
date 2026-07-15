import * as React from 'react';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { theaterIcon } from '../utils/branding';


const AppNavbar = (props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate()

  let user = props.user
  if (user === null || user === undefined) {
    user = {}
  }

  const pages = [
    {
      text: "Now Playing",
      link: "/",
    }
  ];
  if (user.email) {
    pages.push({
      text: "My Tickets",
      link: "/my-tickets",
    });
  }

  const isAdmin = user.is_admin === 1 || user.is_admin === true

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      className="bg-background/70 backdrop-blur-md border-b border-white/10"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <Icon icon={theaterIcon(props.info)} className="text-primary" height={28} />
          <p className="font-marquee text-2xl text-foreground tracking-wider">
            {props.info.theater_name}
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {
          pages.map((page) => (
            <NavbarItem key={page.link}>
              <Link
                as={RouterLink}
                to={page.link}
                aria-current="page"
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm uppercase tracking-widest"
              >
                {page.text}
              </Link>
            </NavbarItem>
          ))
        }
      </NavbarContent>
      <NavbarContent justify="end">
        {
          user.email ?
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" className="text-foreground/80" startContent={
                <Avatar
                  size="sm"
                  name={user.email}
                  classNames={{base: "bg-primary/20 text-primary"}}
                />
              }>
                <span className="hidden md:inline max-w-48 truncate">{user.email}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu" className="text-foreground">
              <DropdownItem
                key="my-tickets"
                id="my-tickets-menu-nav"
                startContent={<Icon icon="solar:ticket-linear" height={18} />}
                onClick={() => navigate("/my-tickets")}
              >
                My Tickets
              </DropdownItem>
              {isAdmin ? (
                <DropdownItem
                  key="admin"
                  id="admin-menu-nav"
                  startContent={<Icon icon="solar:settings-linear" height={18} />}
                  onClick={() => navigate("/admin/showings")}
                >
                  Admin
                </DropdownItem>
              ) : null}
              <DropdownItem
                key="logout"
                id="logout-menu-nav"
                color="danger"
                className="text-danger"
                startContent={<Icon icon="solar:logout-2-linear" height={18} />}
                onClick={() => props.logout()}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          :
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              className="font-semibold uppercase tracking-wider"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </NavbarItem>
        }

      </NavbarContent>
      <NavbarMenu className="bg-background/95 backdrop-blur-md pt-6">
        {pages.map((page) => (
          <NavbarMenuItem key={page.link}>
            <Link as={RouterLink} to={page.link} size="lg" className="w-full text-foreground" onClick={() => setIsMenuOpen(false)}>
              {page.text}
            </Link>
          </NavbarMenuItem>
        ))}
        {isAdmin ? (
          <NavbarMenuItem key="admin-mobile">
            <Link as={RouterLink} to="/admin/showings" size="lg" className="w-full text-foreground" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          </NavbarMenuItem>
        ) : null}
        {user.email ? (
          <NavbarMenuItem key="logout-mobile">
            <Link size="lg" className="w-full text-danger cursor-pointer" onClick={() => props.logout()}>
              Logout
            </Link>
          </NavbarMenuItem>
        ) : (
          <NavbarMenuItem key="login-mobile">
            <Link as={RouterLink} to="/login" size="lg" className="w-full text-primary" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>

  );
};
export default AppNavbar;
