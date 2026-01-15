package com.chat_service.controller;

import com.chat_service.model.ChatMessage;
import com.chat_service.service.ChatSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatSupportService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void handleChatMessage(@Payload ChatMessage chatMessage) {
        String userChannel = "/topic/chat." + chatMessage.getSender();

        messagingTemplate.convertAndSend(userChannel, chatMessage);

        String botReply = chatService.getAutomaticResponse(chatMessage.getContent());

        ChatMessage botMessage = new ChatMessage("ChatBot", botReply, ChatMessage.MessageType.CHAT);
        messagingTemplate.convertAndSend(userChannel, botMessage);
    }

    public void sendOverconsumptionAlert(String deviceId, double value) {
        String alertText = "ATENȚIE! Dispozitivul " + deviceId + " a depășit limita: " + value + " kWh!";
        ChatMessage alert = new ChatMessage("SYSTEM", alertText, ChatMessage.MessageType.NOTIFICATION);
        messagingTemplate.convertAndSend("/topic/public", alert);
    }

    @PostMapping("/chat/internal/alert")
    @ResponseBody
    public void receiveInternalAlert(@RequestBody Map<String, Object> payload) {
        String username = payload.get("username") != null ? payload.get("username").toString() : "Unknown";
        String text = payload.get("message").toString();

        ChatMessage alert = new ChatMessage("SYSTEM", text, ChatMessage.MessageType.NOTIFICATION);

        messagingTemplate.convertAndSend("/topic/chat." + username, alert);

        messagingTemplate.convertAndSend("/topic/public", alert);

        System.out.println("Alerta retransmisa prin WebSocket catre user: " + username);
    }
}