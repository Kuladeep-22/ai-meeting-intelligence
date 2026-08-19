import { Box, Typography, Breadcrumbs } from "@mui/material";

interface Props {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: Props) => {
  return (
    <Box mb={3}>
      <Breadcrumbs>
        <Typography color="text.secondary">Home</Typography>
        <Typography>{title}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" mt={1}>
        {title}
      </Typography>

      {subtitle && (
        <Typography color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default Header;