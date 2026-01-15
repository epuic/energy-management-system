package com.chat_service.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String sender;
    private String content;
    private MessageType type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        NOTIFICATION
    }
}