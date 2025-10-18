import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Popover,
  Box,
  Typography,
  Divider,
  Link,
  IconButton
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

const NavPill = ({ children, onOpen }) => (
  <Button
    onMouseEnter={onOpen}
    onFocus={onOpen}
    endIcon={<ArrowDropDownIcon sx={{ fontSize: 18 }} />}
    sx={{
      fontSize: '1rem',
      fontWeight: 400,
      color: '#666',
      textTransform: 'none',
      px: 3,
      py: 1,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      '&:hover': {
        color: '#007d3a',
        backgroundColor: 'transparent'
      }
    }}
  >
    {children}
  </Button>
);

const MenuItemLink = ({ href, label, desc }) => (
  <Box
    component="a"
    href={href}
    sx={{
      display: 'block',
      p: 1,
      borderRadius: 1,
      textDecoration: 'none',
      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
    }}
  >
    <Typography sx={{ fontWeight: 600, color: '#111' }}>{label}</Typography>
    {desc ? (
      <Typography variant="body2" sx={{ color: '#666' }}>
        {desc}
      </Typography>
    ) : null}
  </Box>
);

const MenuCard = ({ href, title, desc }) => (
  <Box
    component="a"
    href={href}
    sx={{
      display: 'block',
      p: 2,
      borderRadius: 2,
      border: '1px solid rgba(0,0,0,0.1)',
      textDecoration: 'none',
      '&:hover': { borderColor: '#00B14F', bgcolor: 'rgba(0,177,79,0.05)' }
    }}
  >
    <Typography sx={{ fontWeight: 700, color: '#111', mb: 0.5 }}>{title}</Typography>
    <Typography variant="body2" sx={{ color: '#555' }}>
      {desc}
    </Typography>
  </Box>
);

const AppLayout = () => {
  const [anchorPlatform, setAnchorPlatform] = useState(null);
  const [anchorSolutions, setAnchorSolutions] = useState(null);
  const [anchorResources, setAnchorResources] = useState(null);

  const closeAll = () => {
    setAnchorPlatform(null);
    setAnchorSolutions(null);
    setAnchorResources(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{ bgcolor: '#fff', boxShadow: 'none', borderBottom: 'none' }}
      >
        <Container disableGutters maxWidth={false} sx={{ pl: 5, pr: 5 }}>
          <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', pl: 0, pr: 0 }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Box component="a" href="/" sx={{ textDecoration: 'none' }}>
                <Typography variant="h4" sx={{ color: '#000', cursor: 'pointer' }}>
                  BeWorking
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <NavPill onOpen={(event) => setAnchorPlatform(event.currentTarget)}>Platform</NavPill>
              <NavPill onOpen={(event) => setAnchorSolutions(event.currentTarget)}>Spaces</NavPill>
              <NavPill onOpen={(event) => setAnchorResources(event.currentTarget)}>Resources</NavPill>
              <Button
                component="a"
                href="/community"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: '#666',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  '&:hover': {
                    color: '#007d3a',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Community
              </Button>
            </Box>

            <Button
              component="a"
              href="/pricing"
              sx={{
                fontSize: '1rem',
                fontWeight: 400,
                color: '#666',
                textTransform: 'none',
                px: 3,
                py: 1,
                ml: 2,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&:hover': {
                  color: '#007d3a',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Pricing
            </Button>

            <Button
              component="a"
              href="/main/login"
              sx={{
                color: '#009624',
                borderColor: '#009624',
                borderRadius: 0,
                px: 3,
                py: 1,
                ml: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: '1px solid #009624',
                '&:hover': {
                  borderColor: '#007d3a',
                  color: '#007d3a',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Login | Register
            </Button>

            <Box sx={{ ml: 2, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Button
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  fontWeight: 700,
                  color: '#222',
                  textDecoration: 'underline',
                  textTransform: 'none'
                }}
              >
                EN
              </Button>
              <Typography variant="body2" sx={{ color: '#222', fontWeight: 700 }}>
                |
              </Typography>
              <Button variant="text" sx={{ minWidth: 0, px: 1, fontWeight: 700, color: '#222', textTransform: 'none' }}>
                ES
              </Button>
            </Box>

            <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1 }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        <Popover
          open={Boolean(anchorPlatform)}
          anchorEl={anchorPlatform}
          onClose={closeAll}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { mt: 1, p: 2, borderRadius: 2, width: 900, maxWidth: 'calc(100vw - 32px)' } }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.9fr', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#777' }}>
                Capabilities
              </Typography>
              <MenuItemLink href="/platform/dashboard" label="Dashboard" desc="Control center for your office" />
              <MenuItemLink href="/platform/contacts" label="Contacts & CRM" desc="Leads, clients, segmentation" />
              <MenuItemLink href="/platform/invoicing" label="Invoicing" desc="Quotes, invoices, payments" />
              <MenuItemLink href="/platform/files" label="Files" desc="Docs with Drive sync" />
              <MenuItemLink href="/platform/calendar" label="Calendar" desc="Bookings & events" />
              <MenuItemLink href="/platform/support" label="Chat & Tickets" desc="Omnichannel support" />
            </Box>

            <Box>
              <Typography variant="overline" sx={{ color: '#777' }}>
                AI & Integrations
              </Typography>
              <MenuItemLink href="/platform/ai-copilot" label="BeCopilot" desc="AI agents & automation" />
              <MenuItemLink href="/integrations/google" label="Google Workspace" desc="Drive, Gmail, Calendar" />
              <MenuItemLink href="/integrations/whatsapp" label="WhatsApp" desc="Two-way messaging" />
              <MenuItemLink href="/integrations/stripe" label="Stripe" desc="Payments & wallet" />
              <MenuItemLink href="/integrations/hubspot" label="HubSpot" desc="Marketing & sales" />
              <MenuItemLink href="/integrations/trello" label="Trello" desc="Projects & tasks" />
            </Box>

            <Box>
              <Typography variant="overline" sx={{ color: '#777' }}>
                Security
              </Typography>
              <MenuItemLink href="/platform/security" label="Security & Compliance" desc="Roles, audit, GDPR" />
              <MenuItemLink href="/platform/multitenant" label="Multi-tenant" desc="Org & workspace isolation" />
              <Divider sx={{ my: 1 }} />
              <Button component="a" href="/pricing" size="small" sx={{ textTransform: 'none', fontWeight: 800 }}>
                See pricing →
              </Button>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0,177,79,0.08)' }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Powered by BeCopilot</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                AI automates communication, billing, and document workflows.
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <li>
                  <Typography variant="body2">AI replies & summaries</Typography>
                </li>
                <li>
                  <Typography variant="body2">Invoice & receipt parsing</Typography>
                </li>
                <li>
                  <Typography variant="body2">Bank reconciliation</Typography>
                </li>
              </Box>
              <Button
                component="a"
                href="/demo"
                size="small"
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  fontWeight: 800,
                  bgcolor: '#00B14F',
                  color: '#fff',
                  '&:hover': { bgcolor: '#009247' }
                }}
              >
                Watch demo
              </Button>
            </Box>
          </Box>
        </Popover>

        <Popover
          open={Boolean(anchorSolutions)}
          anchorEl={anchorSolutions}
          onClose={closeAll}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { mt: 1, p: 2, borderRadius: 2, width: 900, maxWidth: 'calc(100vw - 32px)' } }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <MenuCard href="/solutions/workspaces" title="Workspaces" desc="Private offices & coworking" />
            <MenuCard href="/solutions/meeting-rooms" title="Meeting rooms" desc="Flexible meeting spaces" />
            <MenuCard href="/solutions/virtual-offices" title="Virtual offices" desc="Registered address + services" />
          </Box>
        </Popover>

        <Popover
          open={Boolean(anchorResources)}
          anchorEl={anchorResources}
          onClose={closeAll}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { mt: 1, p: 2, borderRadius: 2, width: 900, maxWidth: 'calc(100vw - 32px)' } }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#777' }}>
                Learn (Free)
              </Typography>
              <MenuItemLink href="/resources/webinars" label="Webinars" />
              <MenuItemLink href="/resources/guides" label="Guides" />
              <MenuItemLink href="/resources/videos" label="Video tutorials" />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ color: '#777' }}>
                Discover
              </Typography>
              <MenuItemLink href="/blog" label="Blog" />
              <MenuItemLink href="/customers" label="Customer stories" />
              <MenuItemLink href="/events" label="Virtual summits" />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ color: '#777' }}>
                Services
              </Typography>
              <MenuItemLink href="/services/professional" label="Professional services" />
              <MenuItemLink href="/support" label="Support services" />
              <MenuItemLink href="/partners" label="Partner services" />
            </Box>
          </Box>
        </Popover>
      </AppBar>

      <Box sx={{ height: 72 }} />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          overflowX: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, md: 4 }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1240, pt: 4, pb: 8 }}>
          <Outlet />
        </Box>
      </Box>

      <Box component="footer" sx={{ mt: 4, py: 4, bgcolor: '#009624', color: '#fff' }}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 6
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              BeWorking
            </Typography>
            <Link href="/main/index" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Inicio
            </Link>
            <Link href="/main/services" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Servicios
            </Link>
            <Link href="/main/about" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sobre Nosotros
            </Link>
            <Link href="/main/contact" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Contacto
            </Link>
            <Link href="/main/index#precios" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Precios
            </Link>
            <Link href="/main/index#beSpaces" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Blog
            </Link>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              BeSpaces
            </Typography>
            {['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'Zaragoza', 'Vigo', 'Palma de Mallorca', 'Las Palmas de Gran Canaria', 'Málaga'].map((city) => (
              <Link
                key={city}
                href="#"
                color="inherit"
                sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {city}
              </Link>
            ))}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Soporte
            </Typography>
            {['Ayuda', 'FAQ', 'Inversores', 'Carreras'].map((item) => (
              <Link
                key={item}
                href="#"
                color="inherit"
                sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {item}
              </Link>
            ))}
            <Link
              href="mailto:soporte@beworking.es"
              color="inherit"
              sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              info@be-working.com
            </Link>
          </Box>
        </Container>
        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)', opacity: 1, borderBottomWidth: '0.5px' }} />
        <Container
          sx={{
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="inherit">
              © 2025 BeWorking
            </Typography>
            {['Términos', 'Privacidad', 'Sitemap'].map((item) => (
              <Link
                key={item}
                href="#"
                color="inherit"
                sx={{ ml: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                <Typography variant="body2" color="inherit">
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="inherit">
              English
            </Typography>
            <Typography variant="body2" color="inherit">
              € EUR
            </Typography>
            <Link href="#" color="inherit" aria-label="Instagram" sx={{ ml: 1 }}>
              <InstagramIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
            </Link>
            <Link href="#" color="inherit" aria-label="Facebook" sx={{ ml: 1 }}>
              <FacebookIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
            </Link>
            <Link href="#" color="inherit" aria-label="Twitter" sx={{ ml: 1 }}>
              <TwitterIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
            </Link>
            <Link href="#" color="inherit" aria-label="LinkedIn" sx={{ ml: 1 }}>
              <LinkedInIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
            </Link>
            <Link href="#" color="inherit" aria-label="YouTube" sx={{ ml: 1 }}>
              <YouTubeIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;
