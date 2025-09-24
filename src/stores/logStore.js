import { defineStore } from "pinia";
import { ref } from "vue";
import { getLogsByDealId, getUser } from "@/plugins/services/authService";

export const useLogStore = defineStore("logStore", () => {
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
      const response = await getUser();
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

    if (
      log.event === "updated" &&
      log.entity_type === "Task" &&
      log.new_values?.status === "completed"
    ) {
      parts.push(` completed Task ID: ${log.entity_id}.`);
    } else if (
      log.event === "updated" &&
      log.entity_type === "Deal" &&
      log.old_values?.stage_id &&
      log.new_values?.stage_id
    ) {
      const oldStageName = getStageName(log.old_values.stage_id);
      const oldStageColor = getStageColor(log.old_values.stage_id);
      const newStageName = getStageName(log.new_values.stage_id);
      const newStageColor = getStageColor(log.new_values.stage_id);

      parts.push(` moved Deal ID: ${log.entity_id} from `);
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
    } else if (log.event === "created" && log.entity_type === "Deal") {
      parts.push(` created a new Deal with ID: ${log.entity_id}.`);
    } else if (log.event === "created" && log.entity_type === "Comment") {
      parts.push(` added a new Comment on Entity ID: ${log.entity_id}.`);
    } else if (log.event === "created" && log.entity_type === "Task") {
      parts.push(` created a new Task with ID: ${log.entity_id}.`);
    } else {
      parts.push(
        ` updated ${
          log.entity_type === "Deal"
            ? "Deal"
            : log.entity_type === "Task"
            ? "Task"
            : "Comment"
        } ID: ${log.entity_id}.`
      );
      const changes = [];
      for (const key in log.new_values) {
        if (
          Object.prototype.hasOwnProperty.call(log.new_values, key) &&
          log.old_values?.[key] !== undefined &&
          log.old_values?.[key] !== log.new_values[key]
        ) {
          const oldValue = log.old_values[key];
          const newValue = log.new_values[key];

          let formattedOldValue = oldValue === null ? "Unassigned" : oldValue;
          let formattedNewValue = newValue === null ? "Unassigned" : newValue;

          if (key === "assign_by_id" || key === "assigned_to_id") {
            parts.push(` ${key}: `);

            if (oldValue !== null && oldValue !== undefined) {
              parts.push({
                text: getUserName(oldValue),
                backgroundColor: getUserColor(oldValue),
                isBadge: true,
              });
            } else {
              parts.push("Unassigned");
            }
            parts.push(` -> `);
            if (newValue !== null && newValue !== undefined) {
              parts.push({
                text: getUserName(newValue),
                backgroundColor: getUserColor(newValue),
                isBadge: true,
              });
            } else {
              parts.push("Unassigned");
            }
          } else {
            changes.push(
              `${key}: ${formattedOldValue} -> ${formattedNewValue}`
            );
          }
        }
      }
      if (changes.length > 0) {
        parts.push(` Changes: ${changes.join(", ")}.`);
      }
    }
    parts.push(` (${formatDate(log.created_at)})`);
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
