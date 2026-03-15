package com.mealdb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocketConfig
 *
 * Sets up STOMP over WebSocket so the React frontend can
 * receive real-time notifications when meals are favourited.
 *
 * Connection flow:
 *  1. Client connects to  ws://localhost:8080/ws  (SockJS fallback)
 *  2. Client subscribes to  /topic/favourites
 *  3. Server broadcasts to  /topic/favourites  on every toggle
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // In-memory broker; prefix for subscriptions
        config.enableSimpleBroker("/topic");
        // Prefix for messages FROM the client TO the server
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/ws")
            .setAllowedOriginPatterns("*")   // tighten in prod
            .withSockJS();                   // SockJS fallback for older browsers
    }
}
