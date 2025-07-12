import { useState } from "react";
import { Box, IconButton, Drawer, Portal } from "@chakra-ui/react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import NotFoundPage from "@/pages/NotFoundPage";

const ROUTES = { home: "/", projects: "/projects", about: "/about" };

const DrawerNav = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(false);

  return (
    <>
      <Drawer.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="start"
      >
        <Box paddingTop={2} paddingLeft={2}>
          <Drawer.Trigger asChild>
            <IconButton variant="outline" size="md">
              <IoReorderThreeOutline />
            </IconButton>
          </Drawer.Trigger>
        </Box>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>Some Icon</Drawer.Header>
              <Drawer.Body display="flex" flexDirection="column">
                {Object.keys(ROUTES).map((route) => (
                  <Link onClick={handleClick} to={ROUTES[route]}>
                    {route}
                  </Link>
                ))}
              </Drawer.Body>
              <Drawer.Footer>
                <h6>By Nathaniel Chang</h6>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* A catch-all route for 404 pages */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default DrawerNav;
