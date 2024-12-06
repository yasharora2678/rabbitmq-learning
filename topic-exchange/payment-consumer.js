const amqp = require("amqplib");

async function recieveMail() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const payment_routing_key = "payment.*";

        await channel.assertExchange(exchange, "topic", { durable: true});
        await channel.assertQueue("payment_queue", { durable: true});
        await channel.bindQueue("payment_queue", exchange, payment_routing_key)

        channel.consume("payment_queue", (message)=> {
            if(message !== null) {
                console.log("Recieved message from payment queue", JSON.parse(message.content));
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