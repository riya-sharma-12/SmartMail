import { IconFileExport, IconReportSearch } from '@tabler/icons';

// constant
const icons = { IconFileExport, IconReportSearch };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const caraInternalDeptGrievanceSection = {
    id: 'caraDeptsGrievanceSectionRoutes',
    title: 'Grievance-Section',
    type: 'group',
    children: [
        {
            id: 'grievances',
            title: 'Grievances',
            type: 'item',
            url: '/caraDeptsAuth/grievances',
            icon: icons.IconFileExport,
            breadcrumbs: false
        },
        {
            id: 'resolvedGrievancesReport',
            title: 'Resolved Grievances Report',
            type: 'item',
            url: '/caraDeptsAuth/resolvedGrievancesReport',
            icon: icons.IconReportSearch,
            breadcrumbs: false
        }
    ]
};

export default caraInternalDeptGrievanceSection;
