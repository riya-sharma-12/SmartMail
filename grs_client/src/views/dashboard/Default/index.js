import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { CustomGetApi } from 'api';
import { Toaster, toast } from 'react-hot-toast';
// project imports
//import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalEmailLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrievanceBarChart from './TotalGrievanceBarChart';
import { gridSpacing } from 'store/constant';
import BackDrop from 'views/utilities/BackDrop';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const convetObjArray = (obj, data) => {
  try {
    if (!data) {
      obj([])
    } else if (Array.isArray(data)) {
      obj(data);
    } else {
      obj([data])
    }
  } catch (err) {
    toast.error(`Getting Error -- ${err}`);
  }
};
const currentMonth = new Date().getMonth() + 1;


const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingOverlay, setLoadingOverlay] = useState(false);
  const [grievanceStats, setGrievanceStats] = useState([]);
  const [allEmailsStats, setAllMailsStats] = useState({});
  const [grievanceYearlyStats, setGrievanceYearlyStats] = useState([]);
  //const [grievanceCurrYearMonthlyStats, setGrievanceCurrYearMonthlyStats] = useState([]);
  const [currentYearGrie, setCurrentYearGrie] = useState({});
  const [previousYearGrie, setPreviousYearGrie] = useState({});
  const barInitialData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [griesBarData, setGriesBarData] = useState(barInitialData);
  const [compsBarData, setCompsBarData] = useState(barInitialData);
  const [querysBarData, setQuerysBarData] = useState(barInitialData);
  const [resolvedGrieBarData, setResolvedGrieBarData] = useState(barInitialData);
  //console.log(grievanceCurrYearMonthlyStats)

  const getDashboardData = async () => {
    try {
      setLoadingOverlay(true);
      const { data, error } = await CustomGetApi('/admin/getAllEmails');
      console.log("dash-data", data)
      //console.log(data, error);
      if (!data) {
        toast.error(`Failed!, ${error}`)
      }
      else {
        toast.success('All Stats Fetched Successfully.');
        //console.log(data);
        const grievanceData = data?.allGrievances;
        const allEmailsStats = {}
        allEmailsStats.allMails = grievanceData?.length;
        const repliedMails = grievanceData?.filter(item => item?.["email_status"] === 1).length;
        allEmailsStats.repliedMails = repliedMails;
      
        const grievanceStatsData = grievanceData?.grievanceStats;
        const grievanceYearlyStatsData = grievanceData?.grievanceYearlyStats;
        const grievanceCurrYearMonthlyStatsData = grievanceData?.grievanceCurrYearMonthlyStats;
        convetObjArray(setGrievanceStats, grievanceStatsData);
        convetObjArray(setGrievanceYearlyStats, grievanceYearlyStatsData);
        setAllMailsStats(allEmailsStats)
        //convetObjArray(setGrievanceCurrYearMonthlyStats, grievanceCurrYearMonthlyStatsData);
        grievanceYearlyStatsData.map((item) => {
          //console.log(item,currentMonth, "check");
          if (item?.month == currentMonth) {
            setCurrentYearGrie(item)
          } else {
            setPreviousYearGrie(item)
          }
        });

        let grieBarInitialData = [...griesBarData];
        let compsBarInitialData = [...compsBarData];
        let querysBarInitialData = [...querysBarData];
        let resolvedGrieBarInitialData = [...resolvedGrieBarData];
        grievanceCurrYearMonthlyStatsData.map((item) => {
          const month = item.month - 1;
          grieBarInitialData[month] = item.total_grievance;
          setGriesBarData(grieBarInitialData);
          compsBarInitialData[month] = item.total_complains;
          setCompsBarData(compsBarInitialData);
          querysBarInitialData[month] = item.total_query;
          setQuerysBarData(querysBarInitialData);
          resolvedGrieBarInitialData[month] = item.grievance_resolved;
          setResolvedGrieBarData(resolvedGrieBarInitialData);
        })
      }
    } catch (err) {
      //console.log("catch error", err)
      toast.error(`Something Went Wrong!, Getting Exception, ${err}`);
    } finally {
      setLoadingOverlay(false);
    }
  };

  useEffect(() => {
    setLoading(false);
    getDashboardData();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      {isLoadingOverlay && <BackDrop isLoading={isLoadingOverlay} />}
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            {/* <EarningCard isLoading={isLoading} grievanceStats={grievanceStats} /> */}
            <TotalEmailLineChartCard isLoading={isLoading} title={"Total Grievancessss"} grievanceComplains={allEmailsStats?.allMails} grievanceQuerys={allEmailsStats?.repliedMails} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalEmailLineChartCard isLoading={isLoading} title={"Grievances Resolved"} grievanceComplains={grievanceStats[0]?.total_complains_resolved} grievanceQuerys={grievanceStats[0]?.total_query_resolved} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} grievanceStats={grievanceStats} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} grievanceStats={grievanceStats} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrievanceBarChart isLoading={isLoading} griesBarData={griesBarData} compsBarData={compsBarData} querysBarData={querysBarData} resolvedGrieBarData={resolvedGrieBarData} />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} grievanceYearlyStats={grievanceYearlyStats} currentYearGrie={currentYearGrie} previousYearGrie={previousYearGrie} />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
