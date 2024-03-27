const { portalsRx, portalUpdateRx } = require('../../rx');

const DEVICE_DEFAULT = {
  isConnected: false, //{ type: 'boolean' },
  fw: {
    major: 0,
    minor: 0,
    patch: 0
  },
  version: null,
  isActive: 0,
  gameMode: 0,
  code: 0,
  // old
  cleared: null, //{ type: 'number[]' },
  hits: null, //{ type: 'number[]' },
  captures: null, //{ type: 'number[]' },
  p0Hits: null, //{ type: 'number[]' },
  p1Hits: null, //{ type: 'number[]' },
  targetState: null, //{ type: 'number[]' },
  isCleared: false,
  portalType: 0,
  battery: 0,
}

const PORTAL_RESET_VALUE = {
  cleared: [0, 0],
  hits: [0, 0],
  captures: [0, 0],
  p0Hits: [0, 0, 0, 0, 0],
  p1Hits: [0, 0, 0, 0, 0],
  isCleared: false
}

const deviceMap = new Map();



// Reset all portals
const resetPortals = () => {
  deviceMap.forEach((portal) => {
    Object.assign(portal, {
      ...PORTAL_RESET_VALUE
    });
    deviceMap.set(portal.deviceId, portal);
    portalUpdateRx.set(portal);
  });
  portalsRx.set([...Array.from(deviceMap.values())]);
}

const initById = (id) => {
  const device = {
    deviceId: id,
    ...DEVICE_DEFAULT
  };

  deviceMap.set(id, device);
  portalUpdateRx.set(device);
  portalsRx.set([...Array.from(deviceMap.values())]);
}

// MAY BE AN ISSUE BY NOT HAVING DEFAULTS
const updateDeviceInfoById = (id, deviceInfo = {}) => {
  //console.log("updateDeviceInfoById", id, deviceInfo)
  const device = {
    deviceId: id,
    isConnected: true,
    ...deviceInfo,
  }

  deviceMap.set(id, device);
  portalUpdateRx.set(device);
  portalsRx.set([...Array.from(deviceMap.values())]);
}

const updateById = (deviceId, update) => {
  let device = deviceMap.get(deviceId);
  if (!device) device = {
    deviceId,
    isConnected: true
  }

  Object.assign(device, { ...update });
  deviceMap.set(deviceId, device);
  portalUpdateRx.set(device);
  portalsRx.set([...Array.from(deviceMap.values())]);
  return device;
}

const findConnectedPortals = () => {
  return [...Array.from(deviceMap.values()).filter((portal) => portal.isConnected === true)];
}

const findActivePortals = () => {
  return [...Array.from(deviceMap.values()).filter((portal) => portal.isConnected === true && portal?.isActive > 0)];
}


const getDeviceById = (id) => {
  const device = deviceMap.get(id);
  if (device) {
    portalUpdateRx.set(device);
  }

  return device
}

const getAll = () => {
  deviceMap.forEach((dev) => {
    portalUpdateRx.set(dev);
  })
  return portalsRx.value
}

const getConnectedCount = () => {
  const connectedPortals = findConnectedPortals();
  // connectedCountRx.set(connectedPortals.length);
  // return connectedCountRx.value;
  return 0
}



module.exports = {
  initById,
  updateDeviceInfoById,
  getDeviceById,
  getAll,
  updateById,
  getConnectedCount,
  findActivePortals,
  resetPortals
}