import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

const getApprovalsFn = async (params = {}) => {
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
export const getApprovals = withErrorLogging(
  getApprovalsFn,
  "approvalService.getApprovals"
);

const createApprovalFn = async (phone, user_id = null) => {
  return await axios.post("/approvals", { phone: phone, user_id: user_id });
};
export const createApproval = withErrorLogging(
  createApprovalFn,
  "approvalService.createApproval"
);

const updateApprovalFn = async (approvalId, status) => {
  const formData = new FormData();
  formData.append("status", status);
  return await axios.patch(`/approvals/${approvalId}`, formData);
};
export const updateApproval = withErrorLogging(
  updateApprovalFn,
  "approvalService.updateApproval"
);

const getTotalsFn = async () => {
  return await axios.get("/approvals/get-totals");
};
export const getTotals = withErrorLogging(
  getTotalsFn,
  "approvalService.getTotals"
);
