const { deviceTypes } = require("../../config/devices");
const { portalRxService } = require("../")

const initDevice = (clientId) => {
  const clientType = clientId?.split("-");
  if (!clientType) return;
  switch (clientType[0]) {
    case deviceTypes.PORTAL:
      // console.log("PORTAL connected");
      portalRxService.initById(clientId);
      break;
    default:
      return;
  }
}

const connectDevice = (clientId) => {
  const clientType = clientId?.split("-");
  if (!clientType || clientType?.length !== 2) return;
  switch (clientType[0]) {
    case deviceTypes.PORTAL:
      portalRxService.updateById(clientId, { isConnected: true });
      break;
    default:
      return;
  }
}

const findById = (clientId) => {
  const clientType = clientId?.split("-");
  if (!clientType) return;
  switch (clientType[0]) {
    case deviceTypes.PORTAL:
      // console.log("PORTAL findById")
      return portalRxService.getDeviceById(clientId);
    default:
      return;
  }
}

module.exports = {
  initDevice,
  connectDevice,
  findById
}