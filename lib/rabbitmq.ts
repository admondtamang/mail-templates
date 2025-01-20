import client, { Connection, Channel, ConsumeMessage } from 'amqplib'

export class RabbitMQClient<T> {

    private static instance: RabbitMQClient<any>;
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;
    static EMAIL_QUEUE: string = 'email_queue';

    private constructor() {}


    static getInstance<T>(): RabbitMQClient<T> {
        if (!RabbitMQClient.instance) {
            RabbitMQClient.instance = new RabbitMQClient<T>();
        }
        return RabbitMQClient.instance;
    }

    async connect(){    
        if (this.connected) {
            return;
        }

        try{
            console.log(`⌛️ Connecting to Rabbit-MQ Server`, `amqp://${process.env.MQ_USER}:${process.env.MQ_PASSWORD}@${process.env.MQ_HOST}:${process.env.MQ_PORT}`);
            this.connection = await client.connect(
                `amqp://${process.env.MQ_USER}:${process.env.MQ_PASSWORD}@${process.env.MQ_HOST}:${process.env.MQ_PORT}`
            )
            console.log(`✅ Rabbit MQ Connection is ready`);
            this.channel = await this.connection.createChannel()
            console.log(`🛸 Created RabbitMQ Channel successfully`);
            this.connected = true;
        }
        catch(err){
            console.error(err);
            console.error(`❌❌❌Not connected to MQ Server`);
            this.connected = false;
        }
    }

    async sendToQueue(queue: string, message: T){
        try {
            
            await this.connect()    
            await this.channel.assertQueue(queue, { durable: false });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: false })
            console.log(`✅ Message sent`);
            await this.channel.close()
        }
        catch(err){
            console.error(err)
            throw err
        }
        finally {
            if (this.connection) await this.connection.close();
        }
    }

    async consume(queue: string, callback:(message: T)=>void) {
        try {
            if(!this.channel) {
                await this.connect()    
            }
            await this.channel.assertQueue(queue, { durable: true })
            const receve = await this.channel.consume(
                queue,
                (message: ConsumeMessage| null) => {
                    if(!message){
                        return console.error("Invalid incoming message");
                    }
                    this.channel.ack(message);
                    callback(JSON.parse(JSON.stringify(message.content.toJSON())) as T)
                },
                {noAck: false}
            )
            await this.channel.close()
        }
        catch(err){
            console.error(err)
            throw err
        }
        finally {
            if (this.connection) await this.connection.close();
        }
    }
}






