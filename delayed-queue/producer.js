const amqp = require("amqplib");

async function sendToDelayedQueue(batchId, orders, delay) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "delayed_exchange";
    const queue = "delayed_order_queue";

    await channel.assertExchange(exchange, "x-delayed-message", {
      arguments: { "x-delayed-type": "direct" },
    });

    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "");

    const message = JSON.stringify({ batchId, orders });
    channel.publish(exchange, "", Buffer.from(message), {
      headers: { "x-delay": delay },
    });

    console.log(
      `Sent batch ${batchId} update task to delayed queue ${delay} ms delay`
    );

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 5000);
  } catch (error) {}
}

async function processBatchOrders() {
  const batchId = generateBatchId();
  const orders = collectOrdersForBatch();

  console.log(
    `Processing batch ${batchId} with orders: ${JSON.stringify(orders)}`
  );

  await processOrders(orders);

  const delay = 10000;
  sendToDelayedQueue(batchId, orders, delay);
}

function generateBatchId() {
  return "Batch-" + Date.now();
}

function collectOrdersForBatch() {
  return [
    {
      orderId: 1,
      item: "Laptop",
      quantity: 2,
    },
    {
      orderId: 2,
      item: "Phone",
      quantity: 5,
    },
  ];
}

async function processOrders(orders) {
  return new Promise((resolve) => {
    setTimeout(() => {
      orders.map((order) => {
        console.log(
          `Order processing for order id- ${order.orderId} and quantity ${order.quantity}`
        );
      });
      resolve();
    }, 1000);
  });
}

processBatchOrders();
