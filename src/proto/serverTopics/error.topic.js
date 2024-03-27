const { nexusErrorService, deviceService } = require('../../services');

class ErrorTopic {
  constructor(mesApi) {
    this.mesApi = mesApi;
  }

  async topicHandler(client, payload) {
    const [
      errorCode,
      deviceType,
      major,
      minor,
      patch
    ] = this.parsePayload(payload);

    console.log("ErrorTopic", client, errorCode,
      deviceType,
      major,
      minor,
      patch);

    const device = await deviceService.getDeviceById(client);
    if (!device) {
      console.error("ErrorTopic: device not found", client);
    }

    const nexusError = {
      deviceId: client,
      device: device?._id,
      deviceType,
      errorCode,
      fw: {
        major,
        minor,
        patch
      }
    }
    await nexusErrorService.createNexusError(nexusError);
  }

  parsePayload(payload) {
    // code uint16
    const errorCode = Buffer.from(payload.splice(0, 2)).readUint16BE().toString(16).toUpperCase();
    const deviceType = payload.splice(0, 1);
    // firmware uint8[3]
    const firmware = payload.splice(0, 3);

    return [errorCode, ...deviceType, ...firmware];
  }
}

module.exports = ErrorTopic;
