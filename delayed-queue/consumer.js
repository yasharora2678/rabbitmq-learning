const amqp = require("amqplib");

async function processOrderUpdates() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("delayed_order_queue", {
      durable: true,
    });

    channel.consume(
      "delayed_order_queue",
      async (message) => {
        if (message !== null) {
          const batchId = JSON.parse(message.content.toString());
          console.log("Processing order update task for this batch", batchId);

          await updateOrderStatus();
          channel.ack(message);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function updateOrderStatus(batchId) {
    return new Promise((resolve) => {
        setTimeout(()=> {
            console.log('Order status updation for', batchId);
            resolve();
        }, 1000)
    })
}

processOrderUpdates();
