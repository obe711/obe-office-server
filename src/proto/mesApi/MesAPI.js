
const PortalAPI = require('./Portal.api');


class MesAPI {
  constructor(aedes) {
    this.aedes = aedes;
    // Outbound
    this.portalApi = new PortalAPI(this);
    this.aedes.on('publish', this.handleOnPublish);
    this.aedes.on('subscribe', this.handleOnSubscribe)
  }

  handleOnSubscribe = async (subscriptions, client) => {

  }

  /**
    * Handle Inbound notify messages from "notify/notify.c"
    */
  handleOnPublish = async (packet, client) => {

    if (!client) return;
    //console.log("REC PUBLISH!!!!!!!!", client.id, packet.topic);
    const clientType = client?.id?.split("-");
    if (!clientType) {
      console.error("No client type")
      return;
    }

    const { data } = packet.payload.toJSON();

    // console.log("REC PUBLISH!!!!!!!!", client.id, packet.topic, data);
    switch (packet.topic) {


      /**
      * Error Notify API
      * "void send_error(uint8_t *mes, uint8_t len)"
      */
      // case topics.ERROR: {
      //   this.errorTopic.topicHandler(client.id, data);
      //   break;
      // }
      default: {
        console.log("Unknown topic", packet.topic, client.id);
        break;
      }
    }

  }

  publishMessage(topic, payload) {
    if (!topic) return;
    this.aedes.publish({ topic, payload })
  }
}

module.exports = MesAPI;