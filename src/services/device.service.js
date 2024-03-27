const httpStatus = require('http-status');
const { Device } = require('../models');
const ApiError = require('../utils/ApiError');
const { deviceTypes } = require("../config/devices");



const upsertDeviceById = async (deviceId, updateBody) => {
  const deviceUpdate = {
    deviceId,
    deviceName: deviceId,
    isHidden: false,
    ...updateBody
  }
  return Device.findOneAndUpdate({ deviceId }, deviceUpdate, { upsert: true, new: true });
}

const updateByDeviceId = async (deviceId, updateBody) => {
  const found = await Device.findOneAndUpdate({ deviceId }, updateBody, { new: true });
  if (!found) return null;
}

/**
 * Upsert Device
 * @param {string} deviceId
 * @param {string} deviceType
 */
const upsertDevice = async (deviceId, deviceType) => {
  const found = await Device.findOne({ deviceId });
  if (found) {
    found.isConnected = true;
    const saved = await found.save();
    return saved;
  }

  const newDevice = await Device.create({
    deviceId,
    deviceName: deviceId,
    deviceType,
    isHidden: false,
    isConnected: true
  });
  return newDevice;
}

/**
 * Query for devices
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const queryDevices = async (filter, options, search) => {
  Object.assign(filter, { isHidden: false });
  const devices = await Device.paginate(filter, options, search);
  return devices;
};

/**
 * Get device by id
 * @param {string} deviceId
 * @returns {Promise<Device>}
 */
const getDeviceById = async (deviceId) => {
  // return Device.findById(id);
  return Device.findOne({ deviceId });
};


/**
 * Update device by id
 * @param {ObjectId} deviceId
 * @param {Object} updateBody
 * @returns {Promise<Device>}
 */
const updateDeviceById = async (deviceId, updateBody) => {
  const device = await getDeviceById(deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  Object.assign(device, updateBody);
  await device.save();
  return device;
};



/**
 * Delete device by id
 * @param {ObjectId} deviceId
 * @returns {Promise<Device>}
 */
const deleteDeviceById = async (deviceId) => {
  const device = await getDeviceById(deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  await Device.updateMany({ paired: device.deviceId }, { paired: null });
  device.isHidden = true;

  //await device.deleteOne();
  //return device;
  return device.save();
};

/**
 * Get devices by device ids
 * @param {Array(string)} deviceIds 
 * @returns {Promise<Device>}
 */
const getDevicesByIds = (deviceIds) => {
  return Device.find({
    deviceId: {
      $in: deviceIds
    }
  })
}








const getPortalById = (deviceId) => {
  return Device.findOne({ deviceType: deviceTypes.PORTAL, deviceId })
}


const getActivePortals = async () => {
  return Device.find({
    deviceType: deviceTypes.PORTAL,
    isConnected: true,
    "options.code": { $ne: 0 }
  })
}

const initDevices = async () => {
  await Device.updateMany({}, { isConnected: false, team: 0 }).exec();
}

module.exports = {
  upsertDevice,
  queryDevices,
  getDeviceById,
  updateDeviceById,
  upsertDeviceById,
  deleteDeviceById,
  getDevicesByIds,


  getPortalById,
  updateByDeviceId,
  getActivePortals,
  initDevices
};