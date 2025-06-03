import { motion } from 'framer-motion';
import { Paper, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const GrievanceType = ({ grievanceCategory, grievanceType, setGrievanceType, setFormId }) => {
    const isVisible = true;
    const handleTypeSelect = (type) => {
        setGrievanceType(type)
        if (grievanceCategory === 'it') setFormId('02');
        else if (type === 'complain') setFormId('03');
        else setFormId('04');
    };
    return (
        <div>
            <motion.div
                initial={{ y: '-100vh', opacity: 0 }}
                animate={{ y: isVisible ? 0 : '-100vh', opacity: isVisible ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 30, duration: 0.5 }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBlock: '10px',
                    //alignItems: 'center',
                    //height: '100vh', // Adjust as needed
                }}
            >
                <Paper elevation={3} style={{ padding: 20, borderRadius: 16 }}>
                    {/* <Typography variant="h5" gutterBottom>
                        Grievance Type Form
                    </Typography> */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Grievance Type</FormLabel>
                        {grievanceCategory === 'it' ? (
                            <RadioGroup row>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <FormControlLabel
                                        value="complain"
                                        checked={grievanceType === 'complain'}
                                        control={<Radio />}
                                        label={`Compain of - ${grievanceCategory}`}
                                        onClick={() => handleTypeSelect('complain')}
                                    />
                                </Box>
                            </RadioGroup>

                        ) : (
                            <RadioGroup row>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <FormControlLabel
                                        value="complain"
                                        checked={grievanceType === 'complain'}
                                        control={<Radio />}
                                        label={`Compain of - ${grievanceCategory}`}
                                        onClick={() => handleTypeSelect('complain')}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <FormControlLabel
                                        value="query"
                                        checked={grievanceType === 'query'}
                                        control={<Radio />}
                                        label={`Query of - ${grievanceCategory}`}
                                        onClick={() => handleTypeSelect('query')}
                                    />
                                </Box>
                            </RadioGroup>
                        )}
                    </FormControl>
                </Paper>
            </motion.div>
        </div>
    )
}

export default GrievanceType
