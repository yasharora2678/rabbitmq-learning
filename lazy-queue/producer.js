const amqp = require("amqplib");

async function setup() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "notification_exchange";
  const queue = "lazy_queue";
  const routing_key = "notification.key";
  const message =     {
    orderId: 1,
    item: "Laptop",
    quantity: 2,
  };

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, {
    durable: true,
    arguments: {
      "x-queue-mode": "lazy",
    },
  });

  await channel.bindQueue(queue, exchange, routing_key);
  channel.publish(exchange, routing_key, Buffer.from(JSON.stringify(message)), {persistent: true});

  console.log('Message was send', message);

  await channel.close();
  await connection.close();
}

setup();
