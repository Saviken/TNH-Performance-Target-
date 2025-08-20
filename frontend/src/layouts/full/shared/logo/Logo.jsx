import { Link } from "react-router-dom";
// Use public path for logo
import { styled } from "@mui/material/styles";

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 0',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img
        src="/logo-tnh.png"
        alt="TNH Logo"
        style={{ maxHeight: '60px', width: 'auto', display: 'block' }}
      />
    </LinkStyled>
  );
};

export default Logo;
