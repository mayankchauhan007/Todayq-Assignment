
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <footer style={{ alignContent: 'center', backgroundColor: '#2c387e', color: '#fff', padding: '24px', textAlign: 'center', marginTop: 'auto',height:"150px" }}>
      <Typography variant="body2" style={{ marginBottom: '16px' }}>
        &copy; 2024 Insta Food Delivery App.
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Link href="https://github.com/mayankchauhan007/Food-app" color="inherit">
          GitHub
        </Link>
        <Link href="https://www.linkedin.com/in/mayank-kumar-43bb48208/" color="inherit">
          LinkedIn
        </Link>
        <Link href="mayankchauhan20837@gmail.com" color="inherit">
          Email
        </Link>

        <Typography variant="body2" style={{ marginBottom: '16px' }}>
            Contact Me : +918433231040
      </Typography>
        
      </div>
    </footer>
  );
};

export default Footer;