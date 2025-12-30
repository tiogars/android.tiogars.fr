import { Box, Container, IconButton, Tooltip, Divider, Typography, Link, Stack } from '@mui/material';
import { GitHub, BugReport } from '@mui/icons-material';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const inceptionYear = 2025;
  const copyrightYear = inceptionYear === currentYear ? `${inceptionYear}` : `${inceptionYear}-${currentYear}`;

  const handleRepoClick = () => {
    window.open('https://github.com/tiogars/android.tiogars.fr', '_blank', 'noopener,noreferrer');
  };

  const handleIssueClick = () => {
    window.open('https://github.com/tiogars/android.tiogars.fr/issues/new', '_blank', 'noopener,noreferrer');
  };

  const poweredByLinks = [
    { name: 'pnpm', url: 'https://pnpm.io/' },
    { name: 'React', url: 'https://react.dev/' },
    { name: 'MUI', url: 'https://mui.com/' },
    { name: 'MUI Icons', url: 'https://mui.com/material-ui/material-icons/' },
    { name: 'React Router', url: 'https://reactrouter.com/' },
    { name: 'Vite', url: 'https://vite.dev/' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          {/* Copyright */}
          <Typography variant="body2" color="text.secondary">
            © {copyrightYear} Android Apps Manager
          </Typography>

          {/* GitHub Links */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Tooltip title="View Repository">
              <IconButton
                color="primary"
                aria-label="view repository"
                onClick={handleRepoClick}
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Report an Issue">
              <IconButton
                color="primary"
                aria-label="report issue"
                onClick={handleIssueClick}
              >
                <BugReport />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Powered By */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Powered by
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {poweredByLinks.map((link, index) => (
                <Box key={link.name} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="caption"
                    color="text.secondary"
                    underline="hover"
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                  {index < poweredByLinks.length - 1 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>
                      •
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
