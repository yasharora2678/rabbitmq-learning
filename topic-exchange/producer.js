const amqp = require("amqplib");

async function sendMail() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const order_routing_key = "order.placed";
        const payment_routing_key = "payment.processed";

        const message1 = {
            to: "rahul1@gmail.com",
            from: "harish@gmail.com",
            subject: "Order Notification",
            body: "Order Placed"
        }

        const message2 = {
            to: "rahul1@gmail.com",
            from: "harish@gmail.com",
            subject: "Payment Notification",
            body: "Payment Processed"
        }
       // in topic exchange we never bind or create queue in producer it's responsibility of consumer 
        await channel.assertExchange(exchange, "topic", { durable: true});
        
        channel.publish(exchange,order_routing_key,Buffer.from(JSON.stringify(message1)), {persistent: true});
        console.log("Notification was sent to order queue", message1);
        channel.publish(exchange,payment_routing_key,Buffer.from(JSON.stringify(message2)), {persistent: true});
        console.log("Notification was sent to payment queue", message2);

        setTimeout(()=> {
            connection.close();
        }, 5000);
    }   
    catch(error) {
      console.log(error)  
    }
}

sendMail();