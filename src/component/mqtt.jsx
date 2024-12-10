import { useState, useEffect } from "react";
import mqtt from "mqtt";

const MqttComponent = () => {
  // สถานะการเชื่อมต่อและข้อความ
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  // ข้อมูลการเชื่อมต่อ
  const mqttURL = "wss://6bece45f0a054de68c7f5f00fe90a1ab.s1.eu.hivemq.cloud:8884/mqtt"; // HiveMQ Websocket URL
  const mqttOptions = {
    username: "kimzey", // ใส่ username ที่ตั้งค่าไว้ใน HiveMQ
    password: "MMI321project", // ใส่ password ที่ตั้งค่าไว้ใน HiveMQ
  };

  // เชื่อมต่อกับ MQTT Broker เมื่อ Component โหลด
  useEffect(() => {
    const client = mqtt.connect(mqttURL, mqttOptions);

    client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      setIsConnected(true);

      // Subscribe ไปยัง Topic ที่ต้องการ
      client.subscribe("test/topic", (err) => {
        if (!err) {
          console.log("Subscribed to test/topic");
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log(`Message received: ${message.toString()}`);
      setReceivedMessage(message.toString());
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      setIsConnected(false);
    });

    client.on("close", () => {
      console.log("Disconnected");
      setIsConnected(false);
    });

    setClient(client);

    // Clean up เมื่อ Component ถูกถอดออก
    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  // ส่งข้อความไปยัง MQTT Broker
  const handleSendMessage = () => {
    if (client && isConnected) {
      client.publish("test/topic", message, { qos: 1 }, (err) => {
        if (err) {
          console.error("Publish error: ", err);
        } else {
          console.log("Message sent: ", message);
        }
      });
    } else {
      console.log("MQTT Client is not connected");
    }
  };

  return (
    <div>
      <h1>React MQTT Example</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>

      <div>
        <label>Message to send:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <div>
        <h2>Received Message:</h2>
        <p>{receivedMessage}</p>
      </div>
    </div>
  );
};

export default MqttComponent;
