import { defineStore } from "pinia";
import { ref } from "vue";
import { getAllUsers } from "@/plugins/services/userService";
import { getLogsByDealId } from "@/plugins/services/logService";

export const useLogStore = defineStore("log", () => {
  const logs = ref([]);
  const users = ref([]);

  const fetchLogs = async (dealId) => {
    try {
      const response = await getLogsByDealId(dealId);
      if (response.data) {
        logs.value = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      users.value = response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserName = (id) => {
    if (id === null || id === undefined) return "System";
    const user = users.value.find((u) => u.id === id);
    return user ? user.name : `User#${id}`;
  };

  const getUserColor = (id) => {
    const user = users.value.find((u) => u.id === id);
    return user ? user.color_code : "#000";
  };

  const formatLogEntry = (
    log,
    getStageName,
    getStageColor,
    formatDate,
    getUserName,
    getUserColor
  ) => {
    const parts = [];
    const userName = getUserName(log.user_id);
    const userColor = getUserColor(log.user_id);

    parts.push({ text: userName, backgroundColor: userColor, isBadge: true });

    if (log.event === "imported") {
      if (log.entity_type === "Deal") {
        parts.push(` imported a new Deal.`);
      } else if (log.entity_type === "Contact") {
        parts.push(` imported a new Contact.`);
      } else {
        parts.push(` imported a new ${log.entity_type}.`);
      }
      return parts;
    }

    if (log.event === "created") {
      if (log.entity_type === "Deal") {
        parts.push(` created a new Deal.`);
      } else if (log.entity_type === "Comment") {
        parts.push(` added a new Comment.`);
        if (log.new_values?.text_body) {
          parts.push(` "${log.new_values.text_body}"`);
        }
      } else if (log.entity_type === "Task") {
        parts.push(
          ` created a new Task "${log.new_values?.description?.slice(0, 25)}${
            log.new_values?.description?.length > 25 ? "..." : ""
          }".`
        );
      } else if (log.entity_type === "Phone") {
        parts.push(
          ` added a new phone number "${log.new_values?.phone ?? "unknown"}".`
        );
      } else {
        parts.push(` created a new ${log.entity_type}.`);
      }
      return parts;
    }

    if (
      log.event === "updated" &&
      log.entity_type === "Task" &&
      log.new_values?.status === "completed"
    ) {
      parts.push(
        ` completed Task "${log.new_values?.description?.slice(0, 25)}${
          log.new_values?.description?.length > 25 ? "..." : ""
        }".`
      );
      return parts;
    }

    if (log.event === "updated" && log.entity_type === "Deal") {
      const oldStageId = log.old_values?.stage_id;
      const newStageId = log.new_values?.stage_id;

      const assignedChanged =
        Object.prototype.hasOwnProperty.call(
          log.new_values || {},
          "assigned_to_id"
        ) && log.old_values?.assigned_to_id !== log.new_values.assigned_to_id;
      const warrentyChanged = log.new_values?.warrenty;

      if (oldStageId && newStageId && log.new_values?.assigned_to_id === null) {
        const newStageName = getStageName(newStageId);
        const newStageColor = getStageColor(newStageId);
        parts.push(` trashed the deal to `);
        parts.push({
          text: newStageName,
          backgroundColor: newStageColor,
          isBadge: true,
        });
        parts.push(`.`);
        return parts;
      }

      if (oldStageId && newStageId && oldStageId !== newStageId) {
        const oldStageName = getStageName(oldStageId);
        const oldStageColor = getStageColor(oldStageId);
        const newStageName = getStageName(newStageId);
        const newStageColor = getStageColor(newStageId);
        parts.push(` move the deal from `);
        parts.push({
          text: oldStageName,
          backgroundColor: oldStageColor,
          isBadge: true,
        });
        parts.push(` to `);
        parts.push({
          text: newStageName,
          backgroundColor: newStageColor,
          isBadge: true,
        });
        parts.push(`.`);
        return parts;
      }

      if (assignedChanged) {
        const newAssignee = log.new_values.assigned_to_id;
        if (newAssignee !== null && newAssignee !== undefined) {
          parts.push(` assigned this deal to `);
          parts.push({
            text: getUserName(newAssignee),
            backgroundColor: getUserColor(newAssignee),
            isBadge: true,
          });
          parts.push(`.`);
        } else {
          parts.push(` unassigned this deal.`);
        }
        return parts;
      }

      if (warrentyChanged !== null) {
        const warrenty_val = log.new_values.warrenty
          ? "Provided"
          : "Not Provided";
        parts.push(` updated the deal's warrenty to "${warrenty_val}".`);
        return parts;
      }

      const ignoreKeys = new Set([
        "view_count",
        "recontact_count",
        "position",
        "assigned_to_id",
        "stage_id",
        "last_moved_date",
      ]);

      const importantFields = {
        note: "note",
        source_id: "source",
        contact_id: "contact",
        value: "value",
        expected_close_date: "expected close date",
        actual_close_date: "actual close date",
        priority: "priority",
        status: "status",
      };
      const updates = [];
      for (const key in log.new_values || {}) {
        if (!Object.prototype.hasOwnProperty.call(log.new_values, key)) {
          continue;
        }
        if (ignoreKeys.has(key)) continue;
        if (log.old_values?.[key] === undefined) continue;
        if (log.old_values?.[key] === log.new_values[key]) continue;

        const newValue = log.new_values[key];
        const formattedNewValue = newValue === null ? "Unassigned" : newValue;
        const displayKey = importantFields[key] || key;
        updates.push(`${displayKey} to ${formattedNewValue}`);
      }

      const ignoredChanges = [];
      for (const key in log.new_values || {}) {
        if (!Object.prototype.hasOwnProperty.call(log.new_values, key)) {
          continue;
        }
        if (!ignoreKeys.has(key)) continue;
        if (log.old_values?.[key] === undefined) continue;
        if (log.old_values?.[key] === log.new_values[key]) continue;
        ignoredChanges.push(key);
      }

      if (updates.length > 0) {
        parts.push(` updated the deal's ${updates.join(", ")}.`);
      } else if (ignoredChanges.length > 0) {
        parts.push(
          ` updated the deal (internal changes: ${ignoredChanges.join(", ")}).`
        );
      } else {
        parts.push(` updated the deal.`);
      }
      return parts;
    }

    if (log.event === "updated") {
      const updates = [];
      for (const key in log.new_values || {}) {
        if (!Object.prototype.hasOwnProperty.call(log.new_values, key)) {
          continue;
        }
        if (log.old_values?.[key] === undefined) continue;
        if (log.old_values?.[key] === log.new_values[key]) continue;
        const newValue = log.new_values[key];
        const formattedNewValue = newValue === null ? "Unassigned" : newValue;
        updates.push(`${key} to ${formattedNewValue}`);
      }
      if (updates.length > 0) {
        parts.push(` updated ${log.entity_type}'s ${updates.join(", ")}.`);
      } else {
        parts.push(` updated ${log.entity_type}.`);
      }
      return parts;
    }

    parts.push(` performed an action.`);
    return parts;
  };

  return {
    logs,
    users,
    fetchLogs,
    fetchUsers,
    getUserName,
    getUserColor,
    formatLogEntry,
  };
});
