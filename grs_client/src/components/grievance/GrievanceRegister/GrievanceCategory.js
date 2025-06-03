import { motion } from 'framer-motion';
import { Paper, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';


//grievanceCategory
const GrievanceCategory = ({ setGrievanceCategory, setGrievanceType, setFormId }) => {
    const handleCategorySelect = (category) => {
        setGrievanceCategory(category);
        setGrievanceType(null);
        setFormId("01")
        //console.log("selected category", category);
    };
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
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
                        IT Complain Form
                    </Typography> */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Grievance Category</FormLabel>
                        <RadioGroup row>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <FormControlLabel
                                    value="it"
                                    control={<Radio />}
                                    label="IT"
                                    onClick={() => handleCategorySelect('it')}
                                />
                            </Box>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <FormControlLabel
                                    value="program"
                                    control={<Radio />}
                                    label="Program Division"
                                    onClick={() => handleCategorySelect('program')}
                                />
                            </Box>
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </motion.div>
        </div>
    )
}

export default GrievanceCategory;
