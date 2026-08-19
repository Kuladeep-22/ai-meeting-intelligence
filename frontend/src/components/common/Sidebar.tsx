import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TimelineIcon from "@mui/icons-material/Timeline";
import WarningIcon from "@mui/icons-material/Warning";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { Link } from "react-router-dom";

export const SIDEBAR_WIDTH = 260;

interface Props {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: Props) => {
  const menus = [
    { name: "Chats", icon: <ChatIcon />, path: "/" },
    { name: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { name: "Meetings", icon: <EventNoteIcon />, path: "/meetings" },
    { name: "Decisions", icon: <TimelineIcon />, path: "/decisions" },
    { name: "Risks", icon: <WarningIcon />, path: "/risks" },
    { name: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { name: "Teams", icon: <GroupsIcon />, path: "/teams" },
    { name: "AI Assistant", icon: <SmartToyIcon />, path: "/assistant" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const menuList = (
    <List sx={{ width: SIDEBAR_WIDTH }}>
      {menus.map((item) => (
        <ListItemButton
          key={item.name}
          component={Link}
          to={item.path}
          onClick={onClose}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>

          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <>
      {/* Always-visible sidebar on desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        {menuList}
      </Drawer>

      {/* Collapsible sidebar for small screens, toggled via hamburger */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {menuList}
      </Drawer>
    </>
  );
};

export default Sidebar;