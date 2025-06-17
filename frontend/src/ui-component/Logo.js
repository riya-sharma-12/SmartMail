import logo from '../assets/images/Gmail-Logo-2013-2020.png';

const Logo = () => {
  // const theme = useTheme();

  return (
    <div style={{display:'flex', justifyContent:'space-between'}}>
      <img src={logo} alt="Berry" width="55" content='fit' style={{marginInline:'4px'}} /> 
    </div>
  );
};

export default Logo;
