import { useState, useEffect, useCallback } from "react";
import mqtt from "mqtt";

const useMQTT = (options) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    const mqttClient = mqtt.connect(options.url, {
      username: options.username,
      password: options.password,
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT Broker");
      setIsConnected(true);
      if (options.subscribeTopic) {
        mqttClient.subscribe(options.subscribeTopic, (err) => {
          if (!err) {
            console.log(`Subscribed to ${options.subscribeTopic}`);
          }
        });
      }
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`Message received: ${message.toString()}`);
      setReceivedMessage(message.toString());
      options.onMessage?.(topic, message.toString());
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT Connection Error: ", err);
      setIsConnected(false);
    });

    mqttClient.on("close", () => {
      console.log("MQTT Disconnected");
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, [options]);

  const sendMessage = useCallback(
    (topic, message) => {
      if (client && isConnected) {
        client.publish(topic, message, { qos: 1 }, (err) => {
          if (err) {
            console.error("Publish error: ", err);
          } else {
            console.log(`Message sent to ${topic}: ${message}`);
          }
        });
      } else {
        console.log("MQTT Client is not connected");
      }
    },
    [client, isConnected]
  );

  return { isConnected, sendMessage, receivedMessage };
};

export default useMQTT;
