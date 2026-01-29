import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const getApprovalsBase = async (params = {}) => {
  const token = Cookies.get("authToken");
  return axios.get("/approvals", {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
      search: params.search || "",
      type: params.type || "",
      ...params.filters,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createApprovalBase = async (phone, user_id = null) => {
  return await axios.post("/approvals", { phone: phone, user_id: user_id });
};

const updateApprovalBase = async (approvalId, status) => {
  const formData = new FormData();
  formData.append("status", status);
  return await axios.patch(`/approvals/${approvalId}`, formData);
};

export const getApprovals = withErrorLogging(getApprovalsBase, "getApprovals");
export const createApproval = withErrorLogging(createApprovalBase, "createApproval");
export const updateApproval = withErrorLogging(updateApprovalBase, "updateApproval");
