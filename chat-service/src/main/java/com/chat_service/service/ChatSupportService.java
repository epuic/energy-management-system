package com.chat_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class ChatSupportService {
    private final Map<String, String> rules = new HashMap<>();

    @Value("${google.ai.api.key}")
    private String apiKey;

    @Value("${google.ai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public ChatSupportService() {
        rules.put("salut", "Bună! Sunt asistentul tău virtual. Cum te pot ajuta?");
        rules.put("consum", "Consumul tău poate fi vizualizat în timp real pe graficul de monitorizare.");
        rules.put("dispozitiv", "Poți adăuga sau șterge dispozitive din meniul 'Device Management'.");
        rules.put("limita", "Fiecare dispozitiv are o limită maximă de consum orar setată de admin.");
        rules.put("alerta", "Vei primi o notificare aici dacă un dispozitiv depășește limita.");
        rules.put("ajutor", "Te pot ajuta cu info despre consum, erori, cont sau admin.");
        rules.put("admin", "Dacă dorești să vorbești cu un admin, scrie 'contact admin'.");
        rules.put("eroare", "Dacă sistemul nu răspunde, verifică dacă Docker Swarm este pornit.");
        rules.put("cont", "Detaliile tale sunt securizate și pot fi editate din profil.");
        rules.put("multumesc", "Cu plăcere! Sunt aici dacă mai ai și alte întrebări.");
    }

    public String getAutomaticResponse(String userMessage) {
        String msg = userMessage.toLowerCase();
        String ruleResponse = rules.entrySet().stream()
                .filter(entry -> msg.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);

        if (ruleResponse != null) return ruleResponse;

        return askGeminiAI(userMessage);
    }

    private String askGeminiAI(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("Cheia API Gemini nu este configurată!");
        }

        String url = apiUrl.contains("?key=") ? apiUrl + apiKey : apiUrl + "?key=" + apiKey;

        try {
            String fullPrompt = "Ești un asistent util pentru o companie de management al energiei din România. " +
                    "Răspunde concis și profesional în limba română (maxim 2-3 propoziții). " +
                    "Întrebare: " + prompt;

            Map<String, Object> part = new HashMap<>();
            part.put("text", fullPrompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map<String, Object> body = response.getBody();
            if (body == null) {
                throw new RuntimeException("Răspuns gol de la Gemini");
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                if (body.containsKey("error")) {
                    Map<String, Object> error = (Map<String, Object>) body.get("error");
                    throw new RuntimeException("Eroare Gemini: " + error.get("message"));
                }
                throw new RuntimeException("Nu există candidați în răspunsul Gemini");
            }

            Map<String, Object> contentResponse = (Map<String, Object>) candidates.get(0).get("content");
            if (contentResponse == null) {
                throw new RuntimeException("Content lipsă în răspunsul Gemini");
            }

            List<Map<String, Object>> partsResponse = (List<Map<String, Object>>) contentResponse.get("parts");
            if (partsResponse == null || partsResponse.isEmpty()) {
                throw new RuntimeException("Parts lipsă în răspunsul Gemini");
            }

            String text = (String) partsResponse.get(0).get("text");
            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException("Text răspuns gol de la Gemini");
            }

            return text.trim();

        } catch (ClassCastException | NullPointerException e) {
            System.err.println("Eroare la parsarea răspunsului: " + e.getMessage());
            return "Am primit un răspuns neașteptat de la AI. Te rog reformulează întrebarea.";
        } catch (Exception e) {
            System.err.println("EROARE GEMINI: " + e.getMessage());
            return "Sunt puțin ocupat acum. Încearcă să scrii 'ajutoruu'.";
        }
    }

}