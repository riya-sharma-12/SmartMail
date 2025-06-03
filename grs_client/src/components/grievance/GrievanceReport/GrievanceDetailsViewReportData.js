import { grievanceStakeholders } from "views/utilities/assets/localData"
import { Link } from "@mui/material"
export const grievanceDataTableColumns = {
    replyTableColumns: [
        { field: "responser_id", headerName: "Agency_Name/District/State", width: 200 },
        { field: "grievance", headerName: "Grievance/Query", width: 200 },
        {
            field: "upload_doc_path", headerName: "Grievance/Query Document", width: 200, renderCell: (params) => {
                if (params.value && params.value !== "NA") {
                    return <Link href={`/grievance/pdf/${params.value}`} target="_blank">VIEW</Link>;
                } else if (params.value && params.value === "NA") {
                    return params.value;
                }
                return null;
            }
        },
        { field: "grievance_date,", headerName: "Grievance/Query Date", width: 200, renderCell: (params) => params.value?  new Date(params.value).toLocaleDateString() : "NA" },
        {
            field: "responser_type", headerName: "Response From", width: 200, renderCell: (params) => grievanceStakeholders[`${params.value}`]

        },
        { field: "response", headerName: "Response", width: 300 },
        { field: "response_date", headerName: "Response Date", width: 200, renderCell: (params) => params.value?  new Date(params.value).toLocaleDateString() : "NA"  }
    ],
    interimReplyTableColumns: [
        { field: "responser_id", headerName: "Agency_Name/District/State", width: 200 },
        {
            field: "responser_type", headerName: "Response From", width: 200, renderCell: (params) => grievanceStakeholders[`${params.value}`]

        },
        { field: "response", headerName: "Response", width: 300 },
        {
            field: "upload_doc_path", headerName: "Document", width: 200, renderCell: (params) => {
                if (params.value && params.value !== "NA") {
                    return <Link href={`/grievance/pdf/${params.value}`} target="_blank">VIEW</Link>;
                } else if (params.value && params.value === "NA") {
                    return params.value;
                }
                return null;
            }
        },
        { field: "response_date", headerName: "Response Date", width: 200, renderCell: (params) => new Date(params.value).toLocaleDateString() }
    ],
    underProcessTableColumns: [
        { field: "responser_id", headerName: "Agency_Name/District/State", width: 200 },
        {
            field: "responser_type", headerName: "Response From", width: 200, renderCell: (params) => grievanceStakeholders[`${params.value}`]

        },
        { field: "response", headerName: "Response", width: 300 },
        {
            field: "upload_doc_path", headerName: "Document", width: 200, renderCell: (params) => {
                if (params.value && params.value !== "NA") {
                    return <Link href={`/grievance/pdf/${params.value}`} target="_blank">VIEW</Link>;
                } else if (params.value && params.value === "NA") {
                    return params.value;
                }
                return null;
            }
        },
        { field: "response_date", headerName: "Response Date", width: 200, renderCell: (params) => new Date(params.value).toLocaleDateString() }
    ]
}