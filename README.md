
# RabbitMQ Message Tester

A simple Node.js based application to test sending and consuming messages in RabbitMQ queues. This application uses **Materialize CSS** for the frontend, providing a clean and modern interface for interacting with RabbitMQ. It allows you to send messages to specific queues, consume messages with options like Auto Acknowledge, and view real-time updates on message processing.

## Features

- **Message Sender**: Send custom messages to any RabbitMQ queue.
- **Message Consumer**: Subscribe to RabbitMQ queues, with options to set `ack`, `nack`, and `nack-requeue`.
- **Real-time Message History**: View a real-time feed of processing messages, including the status of each message (`processing`, `ack`, `nack`).
- **Clear History**: Easily clear the message processing history.
- **Beautiful UI**: Styled with Materialize CSS for a clean and modern user experience.

## Getting Started

These instructions will help you set up the project and run it locally on your machine.

### Prerequisites

- **Node.js**: You will need to have Node.js installed on your machine.
- **Docker**: Docker is required to run RabbitMQ and the application in containers.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/rabbitmq-message-tester.git
   cd rabbitmq-message-tester
   ```

2. **Run the application using Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   This will build and start the Node.js application and RabbitMQ server in Docker containers.

3. **Access the application**:

   Once the application is up and running, you can access it in your browser at:
   ```
   http://localhost:3999
   ```

4. **RabbitMQ Management Console**:

   You can also access the RabbitMQ Management Console at:
   ```
   http://localhost:15679
   ```
   Use the following credentials to log in:
   - **Username**: `user`
   - **Password**: `password`

## Usage

### Sending Messages

1. Go to the **Send Message** section.
2. Enter the queue name and the message content.
3. Click **Send** to send the message to the specified RabbitMQ queue.

### Consuming Messages

1. Go to the **Consume Message** section.
2. Enter the queue name you want to subscribe to.
3. Set additional options:
   - **Auto Ack**: Automatically acknowledge messages after consuming them.
   - **Response Delay**: Set the delay (in milliseconds) before acknowledging the message.
   - **Response Type**: Choose between `Ack`, `Nack`, or `Nack with Requeue`.
4. Click **Consume** to start consuming messages from the specified queue.
5. A **STOP CONSUME** button will appear to stop the subscription.

### Message History

- The **Message Processing History** table will show real-time updates on the status of each message.
- Messages are displayed with the following status:
  - **Processing** (yellow)
  - **Ack** (green)
  - **Nack** (red)
- Each message entry is timestamped for reference.
- Click **Clear History** to remove the current history from the table.

## Customization

### Changing the RabbitMQ URL

If you need to change the RabbitMQ server URL, you can modify the environment variable `RABBITMQ_URL` in the `docker-compose.yml` file.

### Modifying the Frontend

The frontend uses **Materialize CSS** for styling. If you wish to customize the appearance, you can modify the CSS classes in the `public/index.html` file or add your own styles.

## Built With

- **Node.js** - Backend runtime environment
- **Express.js** - Web framework for Node.js
- **amqplib** - RabbitMQ client for Node.js
- **Materialize CSS** - Frontend framework for building responsive UIs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
