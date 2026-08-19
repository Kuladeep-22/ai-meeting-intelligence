import { useState, MouseEvent } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import InsightsIcon from "@mui/icons-material/Insights";
import { useNavigate } from "react-router-dom";

import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/authStore";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const notifications = useNotificationStore((state) => state.notifications);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <InsightsIcon sx={{ mr: 1.5, display: { xs: "none", sm: "block" } }} />

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          AI Meeting Intelligence
        </Typography>

        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>

        <Box ml={3}>
          <IconButton onClick={handleAvatarClick} size="small">
            <Avatar sx={{ bgcolor: "secondary.main", fontWeight: 600 }}>K</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;