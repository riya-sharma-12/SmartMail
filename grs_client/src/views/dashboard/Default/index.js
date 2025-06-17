import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { CustomGetApi } from 'api';
import { Toaster, toast } from 'react-hot-toast';
// project imports
//import EarningCard from './EarningCard';
import TotalEmailLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalEmailBarChart from './TotalEmailBarChart';
import { gridSpacing } from 'store/constant';
import BackDrop from 'views/utilities/BackDrop';
import ChatBotCard from './chart-data/chatBotCard'; // Adjust path if needed grs_client\src\views\dashboard\Default\chart-data\chatBotCard.js

// ==============================|| DEFAULT DASHBOARD ||============================== //

const convetObjArray = (obj, data) => {
  try {
    if (!data) {
      obj([]);
    } else if (Array.isArray(data)) {
      obj(data);
    } else {
      obj([data]);
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
  const [allEmails, setallEmails] = useState([]);

  //console.log(grievanceCurrYearMonthlyStats)
console.log(grievanceStats);
console.log(currentYearGrie);
console.log(previousYearGrie);
console.log(grievanceYearlyStats);
  const getDashboardData = async () => {
    try {
      setLoadingOverlay(true);
      const { data, error } = await CustomGetApi('/admin/getallEmails');
      console.log('dash-data', data);
      //console.log(data, error);
      if (!data) {
        toast.error(`Failed!, ${error}`);
      } else {
        toast.success('All Stats Fetched Successfully.');
        //console.log(data);
        const grievanceData = data?.allEmails;
        setallEmails(grievanceData);
        const allEmailsStats = {};
        allEmailsStats.allMails = grievanceData?.length;
        const repliedMails = grievanceData?.filter((item) => item?.['email_status'] === 1).length;
        // Count replied mails with LLM reply not equal to 'NA'
        let llmRepliedMails = 0;
//         const llmRepliedMails = grievanceData?.filter(
//           (item) =>
//             item?.replies?.length > 0 &&
//             item.replies.some((reply) => reply?.llm_reply && reply.llm_reply !== 'NA')
//         ).length;
// console.log('llmRepliedMails Count:', llmRepliedMails);
grievanceData?.forEach((item) => {
  if (item?.llm_reply && item.llm_reply !== 'NA') {
    llmRepliedMails++;
  }
});

console.log('llmRepliedMails Count:', llmRepliedMails);

        let allMailsDayCount = 0;

        const allMailsByMonth = new Array(12).fill(0); // Initialize 12 months with 0
        const allRepliedMailsByMonth = new Array(12).fill(0);
        let allMailsByDay = []; // Initialize 12 months with 0
        let allRepliedMailsByDay = [];
        grievanceData?.forEach((item) => {
          const dateStr = item?.['email_created_at'];
          if (dateStr) {
            const date = new Date(dateStr);
            const month = date.getMonth(); // 0 = Jan, 11 = Dec
            allMailsByMonth[month]++;
          }
          if (item?.['email_status'] === 1) {
            const dateStr = item?.['email_replied_at'];
            const date = new Date(dateStr);
            const month = date.getMonth();
            allRepliedMailsByMonth[month]++;
          }
        });

        const newGrivanceData = grievanceData;
        const grouped = {};
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - 13); // last 12 days including today

        newGrivanceData
          ?.filter((email) => {
            const emailDate = new Date(email['email_created_at']);
            return emailDate >= cutoffDate;
          })
          .forEach((email) => {
            const date = new Date(email['email_created_at']).toISOString().split('T')[0];
            if (grouped[date]) {
              grouped[date]++;
            } else {
              grouped[date] = 1;
            }
            allMailsDayCount++;
          });

        const repliedGrouped = {};
        let repliedMailsDayCount = 0;
        newGrivanceData
          ?.filter((email) => {
            if (email?.['email_status'] !== 1) return false;
            const replyDateStr = email['email_replied_at'];
            if (!replyDateStr) return false; // skip if null/undefined
            const replyDate = new Date(replyDateStr);
            return !isNaN(replyDate) && replyDate >= cutoffDate;
          })
          .forEach((email) => {
            const replyDateStr = email['email_replied_at'];
            const date = new Date(replyDateStr).toISOString().split('T')[0];

            if (repliedGrouped[date]) {
              repliedGrouped[date]++;
            } else {
              repliedGrouped[date] = 1;
            }
            repliedMailsDayCount++;
          });

        allMailsByDay = Object.entries(grouped)
          .filter(([date]) => {
            const isValid = !isNaN(new Date(date).getTime());
            if (!isValid) console.warn('Invalid date in grouped object:', date);
            return isValid;
          })
          .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
          .map(([date, count]) => ({ date, count }));
        console.log('--allMailsByDay--', allMailsByDay);

        allRepliedMailsByDay = Object.entries(repliedGrouped)
          .filter(([date]) => {
            const isValid = !isNaN(new Date(date).getTime());
            if (!isValid) console.warn('Invalid date in grouped object:', date);
            return isValid;
          })
          .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
          .map(([date, count]) => ({ date, count }));

        console.log('allRepliedMailsByDay', allRepliedMailsByDay);
        allEmailsStats.allMailsByMonth = allMailsByMonth;
        allEmailsStats.allRepliedMailsByMonth = allRepliedMailsByMonth;
        allEmailsStats.allMailsByDay = allMailsByDay;
        allEmailsStats.allRepliedMailsByDay = allRepliedMailsByDay;
        allEmailsStats.repliedMails = repliedMails;
        allEmailsStats.allMailsDayCount = allMailsDayCount;
        allEmailsStats.llmRepliedMails = llmRepliedMails;
        allEmailsStats.repliedMailsDayCount = repliedMailsDayCount;
        const grievanceStatsData = grievanceData?.grievanceStats;
        const grievanceYearlyStatsData = grievanceData?.grievanceYearlyStats;
        const grievanceCurrYearMonthlyStatsData = grievanceData?.grievanceCurrYearMonthlyStats;
        convetObjArray(setGrievanceStats, grievanceStatsData);
        convetObjArray(setGrievanceYearlyStats, grievanceYearlyStatsData);
        setAllMailsStats(allEmailsStats);
        //convetObjArray(setGrievanceCurrYearMonthlyStats, grievanceCurrYearMonthlyStatsData);
        if (Array.isArray(grievanceYearlyStatsData)) {
  grievanceYearlyStatsData.map((item) => {
    if (item?.month == currentMonth) {
      setCurrentYearGrie(item);
    } else {
      setPreviousYearGrie(item);
    }
  });
}

        let grieBarInitialData = [...griesBarData];
        let compsBarInitialData = [...compsBarData];
        let querysBarInitialData = [...querysBarData];
        let resolvedGrieBarInitialData = [...resolvedGrieBarData];
       if (Array.isArray(grievanceCurrYearMonthlyStatsData)) {
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
  });
}}}
catch (err) {
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
    //     <Grid container spacing={gridSpacing}>
    //       {isLoadingOverlay && <BackDrop isLoading={isLoadingOverlay} />}
    //       <Toaster position="top-center" reverseOrder={false}></Toaster>
    //       <Grid item xs={12}>
    //         <Grid container spacing={gridSpacing}>
    //           <Grid item lg={4} md={6} sm={6} xs={12}>
    //             {/* <EarningCard isLoading={isLoading} grievanceStats={grievanceStats} /> */}

    //             <TotalEmailLineChartCard
    //               isLoading={isLoading}
    //               title={'Stats By Month'}
    //               grievanceComplains={allEmailsStats?.allMails}
    //               grievanceQuerys={allEmailsStats?.repliedMails}
    //               allMailsData={allEmailsStats?.allMailsByMonth}
    //               allRepliedMails={allEmailsStats?.allRepliedMailsByMonth}
    //             />
    //           </Grid>
    //           <Grid item lg={4} md={6} sm={6} xs={12}>
    //             <TotalEmailLineChartCard
    //               isLoading={isLoading}
    //               title={'Stats By Day (last 12 days)'}
    //               grievanceComplains={allEmailsStats?.allMailsDayCount}
    //               grievanceQuerys={allEmailsStats?.repliedMailsDayCount}
    //               allMailsData={allEmailsStats?.allMailsByDay}
    //               allRepliedMails={allEmailsStats?.allRepliedMailsByDay}
    //             />
    //           </Grid>
    //           <Grid item lg={4} md={12} sm={12} xs={12}>
    //             <Grid container spacing={gridSpacing}>
    //               <Grid item sm={6} xs={12} md={6} lg={12}>
    //   <TotalIncomeDarkCard isLoading={isLoading} allEmailsStats={allEmailsStats} />
    // </Grid>
    // <Grid item sm={6} xs={12} md={6} lg={12}>
    //   <TotalIncomeLightCard isLoading={isLoading} allEmailsStats={allEmailsStats} />
    // </Grid>
    //   <Grid item xs={12}>   {/* or use sm/md/lg as needed */}
    //   </Grid>
    //             </Grid>
    //               <ChatBotCard/>
    //           </Grid>
    //         </Grid>
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Grid container spacing={gridSpacing}>
    //           <Grid item xs={12} md={8}>
    //             <TotalGrievanceBarChart emailData={allEmails} />
    //           </Grid>
    //         </Grid>
    //       </Grid>
    //     </Grid>

    <Grid container spacing={gridSpacing}>
      {isLoadingOverlay && <BackDrop isLoading={isLoadingOverlay} />}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Side: Col 1 and 2 (8 columns total) */}
      <Grid item lg={8} md={12} xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Row 1 - Two Line Chart Cards */}
          <Grid item xs={12} md={6}>
            <TotalEmailLineChartCard
              isLoading={isLoading}
              title="Monthly Email Activity"
              grievanceComplains={allEmailsStats?.allMails}
              grievanceQuerys={allEmailsStats?.repliedMails}
              allMailsData={allEmailsStats?.allMailsByMonth}
              allRepliedMails={allEmailsStats?.allRepliedMailsByMonth}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TotalEmailLineChartCard
              isLoading={isLoading}
              title="Daily Email Activity (Last 14 Days)"
              grievanceComplains={allEmailsStats?.allMailsDayCount}
              grievanceQuerys={allEmailsStats?.repliedMailsDayCount}
              allMailsData={allEmailsStats?.allMailsByDay}
              allRepliedMails={allEmailsStats?.allRepliedMailsByDay}
            />
          </Grid>

          {/* Row 2 - Bar Chart */}
          <Grid item xs={12}>
            <TotalEmailBarChart emailData={allEmails} />
          </Grid>
        </Grid>
      </Grid>

      {/* Right Side: Col 3 (4 columns) spans both rows visually */}
      <Grid item lg={4} md={12} xs={12}>
        <Grid container spacing={gridSpacing} direction="column">
          <Grid item>
            <TotalIncomeDarkCard isLoading={isLoading} allEmailsStats={allEmailsStats} />
          </Grid>
          <Grid item>
<TotalIncomeLightCard isLoading={isLoading} llmRepliedMails={allEmailsStats?.llmRepliedMails ?? 0} />
          </Grid>
          <Grid item>
            <ChatBotCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
