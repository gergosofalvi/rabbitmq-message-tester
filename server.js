const express = require('express');
const amqp = require('amqplib');
const path = require('path');
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

let channel, connection;
let processedMessages = []; // Store processed messages
let messageIdCounter = 1; // Unique ID generator for messages

// Connect to RabbitMQ server
async function connect() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('RabbitMQ connected successfully');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
}

connect();

// Send message to a queue
app.post('/send', async (req, res) => {
    const { queue, message } = req.body;

    try {
        if (!channel) throw new Error('RabbitMQ channel is not initialized');

        // Create or check the queue (dynamically)
        await channel.assertQueue(queue, { durable: true });
        // Send message
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to queue ${queue}: ${message}`);
        res.status(200).json({ success: true, message: `Message sent to queue ${queue}` });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Error sending message', details: error.message });
    }
});

let consumerTag = null;

// Consume message from a queue
app.post('/consume', async (req, res) => {
    const { queue, autoAck, delay, responseType } = req.body;

    try {
        if (!channel) throw new Error('RabbitMQ channel is not initialized');

        // Create or check the queue (dynamically)
        await channel.assertQueue(queue, { durable: true });

        // Set up consumer
        const consumeOptions = { noAck: autoAck };
        const consumer = await channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                const timestamp = new Date().toLocaleString();

                // Processing message
                const processingId = messageIdCounter++;
                processedMessages.push({
                    id: processingId,
                    queue,
                    messageContent,
                    status: 'processing',
                    responseType: null,
                    timestamp
                });

                setTimeout(() => {
                    // Handle response and processing completion
                    const completedId = messageIdCounter++;
                    const completedTimestamp = new Date().toLocaleString();

                    if (responseType === 'ack') {
                        channel.ack(msg);
                    } else if (responseType === 'nack') {
                        channel.nack(msg, false, false);
                    } else if (responseType === 'nack-requeue') {
                        channel.nack(msg, false, true);
                    }

                    // Add new entry for processed message
                    processedMessages.push({
                        id: completedId,
                        queue,
                        messageContent,
                        status: 'processed',
                        responseType,
                        timestamp: completedTimestamp
                    });

                    console.log(`Processed message with delay ${delay}ms and response: ${responseType}`);
                }, delay);
            }
        }, consumeOptions);

        consumerTag = consumer.consumerTag;
        console.log(`Subscribed to queue ${queue} with consumerTag: ${consumerTag}`);
        res.status(200).json({ success: true, message: `Subscribed to queue ${queue}`, consumerTag });
    } catch (error) {
        console.error('Error consuming message:', error);
        res.status(500).json({ success: false, error: 'Error consuming message', details: error.message });
    }
});

// Stop consuming messages
app.post('/stop-consume', async (req, res) => {
    try {
        if (!consumerTag) throw new Error('No active consumer found');

        await channel.cancel(consumerTag);
        console.log(`Stopped consuming from queue with consumerTag: ${consumerTag}`);
        consumerTag = null;
        res.status(200).json({ success: true, message: 'Stopped consuming' });
    } catch (error) {
        console.error('Error stopping consumer:', error);
        res.status(500).json({ success: false, error: 'Error stopping consumer', details: error.message });
    }
});

// Get processed message history
app.get('/processed-messages', (req, res) => {
    res.status(200).json(processedMessages);
});

// Clear message history
app.post('/clear-history', (req, res) => {
    processedMessages = [];
    res.status(200).json({ success: true, message: 'History cleared' });
});

// Start server
const PORT = process.env.PORT || 3999;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

