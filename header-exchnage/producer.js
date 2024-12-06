const amqp = require("amqplib");

async function sendNotification(headers, message) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";

    await channel.assertExchange(exchange, "headers", { durable: true });
    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
      persistent: true,
      headers,
    });
    console.log("Notification was sent with headers", message);

    setTimeout(() => {
      connection.close();
    }, 5000);
  } catch (error) {
    console.log(error);
  }
}

sendNotification(
  {
    "x-match": "all",
    "notification-type": "new_video",
    "content-type": "video",
  },
  "New music video uploaded"
);
sendNotification(
  {
    "x-match": "all",
    "notification-type": "live_stream",
    "content-type": "gaming",
  },
  "Gaming live stream uploaded"
);
sendNotification(
  {
    "x-match": "any",
    "notification-type-comment": "comment",
    "content-type": "vlog",
  },
  "New comment on your vlog"
);
sendNotification(
  {
    "x-match": "any",
    "notification-type-like": "like",
    "content-type": "vlog",
  },
  "Someone liked your comment"
);
sendNotification(
    {
      "x-match": "any",
      "content-type": "vlog",
    },
    "Someone viewed your vlog"
);
sendNotification(
    {
      "x-match": "any",
      "content-type": "symapthy",
    },
    "Someone viewed your vlog"
);
