const amqp = require("amqplib");

async function recieveMail() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        await channel.assertQueue("priority_queue", { 
            durable: true,
            arguments: {"x-max-priority": 10}
        });

        channel.consume("priority_queue", (message)=> {
            if(message !== null) {
                console.log("Recieved message from priority queue", JSON.parse(message.content));
                channel.ack(message)
            }
        })
    }   
    catch(error) {
      console.log(error)  
    }
}

recieveMail();