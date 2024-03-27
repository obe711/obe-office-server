
const [
  _GROUP_OTA,
  GROUP_SET_COLOR,
  GROUP_SET_BRIGHTNESS
] = new Array(3).fill(0).map((_, i) => i);

class PortalAPI {
  constructor(mesApi) {
    this.mesApi = mesApi;
  }

  portalSetColor(buff = []) {
    this.mesApi.publishMessage(`/portals`, Buffer.from([GROUP_SET_COLOR, ...buff]));
  };

  portalSetBrightness(brightness = 255) {
    this.mesApi.publishMessage(`/portals`, Buffer.from([GROUP_SET_BRIGHTNESS, brightness]));
  };
}

module.exports = PortalAPI;