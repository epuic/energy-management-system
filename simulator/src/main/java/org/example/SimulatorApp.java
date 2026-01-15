package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Properties;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class SimulatorApp {

    private final static String HOST = "rabbitmq";
    private final static String USER = "admin";
    private final static String PASS = "admin";

    private final static String EXCHANGE_NAME = "data.collection.exchange";
    private final static String ROUTING_KEY = "data.collection.queue";

    private Long deviceId;
    private double currentBaseLoad = 0.5;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) {
        SimulatorApp app = new SimulatorApp();
        try {
            app.loadConfig();
            app.startSimulation();
        } catch (Exception e) {
            System.err.println("Simulator failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void loadConfig() throws IOException {
        Properties prop = new Properties();
        try (FileInputStream fis = new FileInputStream("config.properties")) {
            prop.load(fis);
            this.deviceId = Long.parseLong(prop.getProperty("device.id"));
        } catch (IOException e) {
            System.err.println("Configuration file not found. Using default Device ID (1).");
            this.deviceId = 1L;
        }
    }


    private void startSimulation() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setUsername(USER);
        factory.setPassword(PASS);

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.exchangeDeclare(EXCHANGE_NAME, "direct", true);

            ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
            scheduler.scheduleAtFixedRate(
                    () -> publishMeasurement(channel),
                    0,
                    10,
                    TimeUnit.MINUTES
            );

            System.out.println("Simulator started for Device ID: " + deviceId);

            Thread.currentThread().join();

        }
    }

    private void publishMeasurement(Channel channel) {
        double measurementValue = generateConsumption();
        long timestamp = Instant.now().toEpochMilli();

        MeasurementDTO dto = new MeasurementDTO(timestamp, deviceId, measurementValue);

        try {
            String jsonMessage = objectMapper.writeValueAsString(dto);
            channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, jsonMessage.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Sent measurement: " + measurementValue);
        } catch (IOException e) {
            System.err.println("Error publishing message: " + e.getMessage());
        }
    }

    private double generateConsumption() {
        int hour = Instant.now().atZone(ZoneId.systemDefault()).getHour();
        double factor;

        if (hour >= 22 || hour < 6) {
            factor = 0.5;
        } else if (hour >= 18 && hour < 22) {
            factor = 1.5;
        } else {
            factor = 1.0;
        }

        Random rand = new Random();
        double fluctuation = (rand.nextDouble() - 0.5) * 0.1;

        currentBaseLoad = currentBaseLoad * 0.9 + (1.0 + fluctuation) * factor * 0.1;

        return Math.max(0.1, currentBaseLoad * 1.5 + rand.nextDouble() * 0.2);
    }
}