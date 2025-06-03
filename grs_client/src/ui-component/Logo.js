// material-ui
//import { useTheme } from '@mui/material/styles';
// import govtLogo from 'assets/images/govt_logo1.png';
// import unityLogo from 'assets/images/logo_unity1.png';
import logo from '../assets/images/Gmail-Logo-2013-2020.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * 
     *
     */
    <div style={{display:'flex', justifyContent:'space-between'}}>
      {/* <img src={govtLogo} alt="Berry" width="30" content='fit' style={{marginInline:'4px'}} />
      <img src={unityLogo} alt="Berry" width="40" content='fit' style={{marginInline:'4px'}} />*/
      <img src={logo} alt="Berry" width="45" content='fit' style={{marginInline:'4px'}} /> }
    </div>
  );
};

export default Logo;
