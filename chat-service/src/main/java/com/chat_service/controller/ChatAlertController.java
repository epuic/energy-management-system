package com.chat_service.controller;


import com.chat_service.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class ChatAlertController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/notify")
    public void receiveAlertFromMonitoring(@RequestBody Map<String, Object> data) {
        String userId = data.get("userId").toString();
        String message = data.get("message").toString();

        ChatMessage alert = new ChatMessage("SYSTEM", message, ChatMessage.MessageType.NOTIFICATION);
        messagingTemplate.convertAndSend("/topic/chat." + userId, alert);
    }
}
