import http from "./http";


export const getHourlyConsumptionApi = (deviceId, dateString) =>
  http.get(`/api/monitoring/consumption/${deviceId}`, {
    params: {
      date: dateString,
    },
  });