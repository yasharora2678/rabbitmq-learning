const amqp = require("amqplib");

async function sendMail() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const message = {
            to: "rahul1@gmail.com",
            from: "harish@gmail.com",
            subject: "Notification",
            body: "Notification Sent"
        }

        await channel.assertExchange(exchange, "fanout", { durable: true});

        channel.publish(exchange,'',Buffer.from(JSON.stringify(message)), {persistent: true});
        console.log("Notification was sent to  all queue", message);

        setTimeout(()=> {
            connection.close();
        }, 5000);
    }   
    catch(error) {
      console.log(error)  
    }
}

sendMail();