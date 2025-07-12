import React from "react";
import { Box, Container, Tabs } from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import MyTimeline from "./MyTimeline";
import Hobbies from "./Hobbies";
import Resume from "./Resume";

const TABS = {
  timeline: [<LuFolder />, <MyTimeline />],
  hobbies: [<LuSquareCheck />, <Hobbies />],
  resume: [<LuUser />, <Resume />],
};

const AboutPage = () => {
  return (
    <Container>
      <Tabs.Root
        lazyMount
        unmountOnExit
        defaultValue="timeline"
        variant="enclosed"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Tabs.List>
          {Object.keys(TABS).map((tab) => (
            <Tabs.Trigger key={tab} value={tab}>
              {TABS[tab][0]}
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Box paddingY={4} display="flex" justifyContent="center">
          {Object.keys(TABS).map((tab) => (
            <Tabs.Content key={tab} value={tab}>
              {TABS[tab][1]}
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>
    </Container>
  );
};

export default AboutPage;
