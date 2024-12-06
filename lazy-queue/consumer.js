const amqp = require("amqplib");

async function consume() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        await channel.assertQueue("lazy_queue", { 
            durable: true,
            arguments: {
                "x-queue-mode": "lazy",
            }
        });

        channel.consume("lazy_queue", (message)=> {
            if(message !== null) {
                console.log("Recieved message from lazy queue", JSON.parse(message.content));
                channel.ack(message)
            }
        })
    }   
    catch(error) {
      console.log(error)  
    }
}

consume();