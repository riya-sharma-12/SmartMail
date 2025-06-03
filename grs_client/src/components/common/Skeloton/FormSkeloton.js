import { Grid, Skeleton, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const variants = ['h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1', 'h1',];

function TypographyDemo(props) {
    const { loading = false } = props;

    return (
        <div>
            {variants.map((variant) => (
                <Typography component="div" key={variant} variant={variant}>
                    {loading ? <Skeleton /> : variant}
                </Typography>
            ))}
        </div>
    );
}

TypographyDemo.propTypes = {
    loading: PropTypes.bool,
};

const FormSkeloton = () => {
    //const { loading = false } = props;
    return (
        <div>
            <Grid container spacing={8}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginBlock: '10px',
                }}
            >
                <Grid item xs>
                    <TypographyDemo loading />
                </Grid>
                <Grid item xs>
                    {/* <TypographyDemo /> */}
                </Grid>
            </Grid>
        </div>
    )
}

export default FormSkeloton;
