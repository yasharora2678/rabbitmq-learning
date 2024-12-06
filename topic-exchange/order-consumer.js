const amqp = require("amqplib");

async function recieveMail() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const order_routing_key = "order.*";

        await channel.assertExchange(exchange, "topic", { durable: true});
        await channel.assertQueue("order_queue", { durable: true});
        await channel.bindQueue("order_queue", exchange, order_routing_key)

        channel.consume("order_queue", (message)=> {
            if(message !== null) {
                console.log("Recieved message from order queue", JSON.parse(message.content));
                channel.ack(message)
            }
        },
        {noAck: false}
    )
    }   
    catch(error) {
      console.log(error)  
    }
}

recieveMail();