import { forwardRef, ReactNode } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, useMediaQuery, CardProps } from '@mui/material';

// project import
import Highlighter from './third-party/Highlighter';

// header style
const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //

interface MainCardProps extends CardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentSX?: object;
  darkTitle?: boolean;
  secondary?: ReactNode;
  shadow?: string;
  title?: string | ReactNode;
  codeHighlight?: boolean;
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentSX = {},
      darkTitle,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const matchDownSS = useMediaQuery(theme.breakpoints.down('ss'));
    const finalBoxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;
    const finalContentSX = { ...contentSX, p: matchDownSS ? 0 : '1rem' };

    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderRadius: 1.2,
          borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A800,
          boxShadow: finalBoxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : 'inherit',
          ':hover': {
            boxShadow: finalBoxShadow ? shadow || theme.customShadows.z1 : 'inherit'
          },
          '& pre': {
            m: 0,
            p: '16px !important',
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.75rem'
          },
          ...sx
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'h4' }} title={title} action={secondary} />}
        {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}

        {/* card content */}
        {content && <CardContent sx={finalContentSX}>{children}</CardContent>}
        {!content && children}
        {/* card footer - clipboard & highlighter  */}
        {codeHighlight && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Highlighter codeHighlight={codeHighlight} main>
              {children}
            </Highlighter>
          </>
        )}
      </Card>
    );
  }
);

MainCard.displayName = 'MainCard';

export default MainCard;

