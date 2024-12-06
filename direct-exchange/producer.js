const amqp = require("amqplib");

async function sendMail() {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "mail_exchange";
        const user_routing_key = "send_mail_to_users";
        const subscriber_routing_key = "send_mail_to_subscribed_users";

        const message1 = {
            to: "rahul@gmail.com",
            from: "harish@gmail.com",
            subject: "Hello TP mail",
            body: "Hello Rahul!!"
        }

        const message2 = {
            to: "rahul@gmail.com",
            from: "harish@gmail.com",
            subject: "Hello TP mail",
            body: "Hello Rahul Our subsriber!!"
        }

        await channel.assertExchange(exchange, "direct", { durable: false});
        
        await channel.assertQueue("users_mail_queue", { durable: false});
        await channel.assertQueue("subscribed_users_mail_queue", { durable: false});

        await channel.bindQueue("users_mail_queue", exchange, user_routing_key);
        await channel.bindQueue("subscribed_users_mail_queue", exchange, subscriber_routing_key);

        channel.publish(exchange,user_routing_key,Buffer.from(JSON.stringify(message1)));
        console.log("Mail data was sent to users queue", message1);
        channel.publish(exchange,subscriber_routing_key,Buffer.from(JSON.stringify(message2)));
        console.log("Mail data was sent to subscriber queue", message2);

        setTimeout(()=> {
            connection.close();
        }, 5000);
    }   
    catch(error) {
      console.log(error)  
    }
}

sendMail();