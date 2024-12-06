const amqp = require("amqplib");

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "priority_exchange";
    const routing_key = "priority_key";
    const data = [
      {
        msg: "Hello High Priority",
        priority: 10,
      },
      {
        msg: "Hello Medium Priority",
        priority: 5,
      },
      {
        msg: "Hello Low Priority",
        priority: 2,
      },
    ];

    await channel.assertExchange(exchange, "direct", { durable: true });

    await channel.assertQueue("priority_queue", {
      durable: true,
      arguments: { "x-max-priority": 10 },
    });

    await channel.bindQueue("priority_queue", exchange, routing_key);

    data.map((msg)=>{
        channel.publish(exchange, routing_key, Buffer.from(JSON.stringify(msg)));
    });

    console.log("Mail data was sent to priority queue");
    setTimeout(() => {
      connection.close();
    }, 5000);
  } catch (error) {
    console.log(error);
  }
}

sendMail();
