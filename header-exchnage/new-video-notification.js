const amqp = require("amqplib");

async function recieveNotification() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";

        await channel.assertExchange(exchange, "headers", { durable: true});

        const queue = await channel.assertQueue("", { exclusive: true});
        console.log("Waiting for msgs =>", queue)

        await channel.bindQueue(queue.queue, exchange, "", {
            "x-match": "all",
            "notification-type": "new_video",
            "content-type": "video"
        });

        channel.consume(queue.queue, (message)=> {
            if(message !== null) {
                console.log(`Recieved message from ${queue.queue} queue`, JSON.parse(message.content));
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

recieveNotification();