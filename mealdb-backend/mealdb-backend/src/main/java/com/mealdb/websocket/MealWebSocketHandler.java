package com.mealdb.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * MealWebSocketHandler
 *
 * Handles inbound STOMP messages and broadcasts outbound events.
 *
 * Frontend subscribes to  /topic/favourites
 * and receives a notification string whenever a meal is
 * added or removed from favourites.
 *
 * You can also inject SimpMessagingTemplate in any Spring
 * service / controller to push messages programmatically.
 */
@Slf4j
@Controller
public class MealWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public MealWebSocketHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Client → Server:  /app/favourite.add
     * Server → All subscribers:  /topic/favourites
     *
     * @param mealName the meal name sent from the client
     * @return broadcast notification string
     */
    @MessageMapping("/favourite.add")
    @SendTo("/topic/favourites")
    public String notifyFavouriteAdded(String mealName) {
        log.info("WS: favourite added — {}", mealName);
        return "🍽️ \"" + mealName + "\" was added to favourites!";
    }

    /**
     * Programmatic broadcast — call this from FavouriteService
     * after a toggle to push updates to all connected clients.
     */
    public void broadcastFavouriteChange(String mealName, String action) {
        String message = action.equals("added")
                ? "❤️ \"" + mealName + "\" added to favourites!"
                : "💔 \"" + mealName + "\" removed from favourites.";
        messagingTemplate.convertAndSend("/topic/favourites", message);
    }
}
