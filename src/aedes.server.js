const config = require('./config/config');
const logger = require('./config/logger');
const aedes = require('aedes')({ heartbeatInterval: 1000, connectTimeout: 1000 })
const server = require('net').createServer(aedes.handle);
const MesAPI = require('./proto/mesApi/MesAPI');
const { deviceService, deviceRxService } = require('./services');


server.listen(config.mqttPort, function () {
  logger.info(`MQTT listening to port: ${config.mqttPort}`);
})

server.on('error', function (err) {
  logger.error(`MQTT Server error - ${err.messgae}`);
  process.exit(1)
});

aedes.on('subscribe', async function (subscriptions, client) {
  logger.info(`MQTT client \x1b[32m${client ? client.id : client}\x1b[0m subscribed to topic: \n${subscriptions.map(s => s.topic).join('\n')} \nfrom broker, ${aedes.id}`)
  deviceRxService.connectDevice(client.id);
})

aedes.on('unsubscribe', function (subscriptions, client) {
  //logger.info(`MQTT client \x1b[32m${client ? client.id : client}\x1b[0m unsubscribed from topics: \n${subscriptions.join('\n')} \nfrom broker, ${aedes.id}`)
})

aedes.on('client', async function (client) {
  if (!client) return;
  logger.info(`Client Connected: ${client.id} - ${aedes.id}`);
  deviceRxService.initDevice(client.id)
  const clientType = client?.id?.split("-");
  if (!clientType) return;
  if (clientType.length !== 2) return null;
  //
  // TODO: Validate client.id
  //
  if (clientType[0] === "ENGINE") return;
  //
  //
  await deviceService.upsertDevice(client.id, clientType[0], clientType[1]);
  // audioService.playTargetConnected();
})

aedes.on('clientDisconnect', async function (client) {
  logger.error(`Client Disconnected: ${client.id} - ${aedes.id}`);
  if (!client) return;
  deviceRxService.initDevice(client.id);
})

aedes.on('clientError', function (client, err) {
  logger.error(`client error: ${client.id} - ${err.message}`);
  deviceRxService.initDevice(client.id)
})

aedes.on('connectionError', function (client, err) {
  logger.error(`connection error: ${client.id} - ${err.message}`);
});

function closeMqttServer(e) {
  logger.error(`closeMqttServer: ${e.message}`);
  console.error(e)
  if (server) server.close();

  process.kill(process.pid, 'SIGTERM');
  process.exit(1);
}

process.on('uncaughtException', closeMqttServer);
process.on('unhandledRejection', closeMqttServer);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  closeMqttServer();
});


module.exports.aedesServer = aedes;
module.exports.mesApi = new MesAPI(aedes);