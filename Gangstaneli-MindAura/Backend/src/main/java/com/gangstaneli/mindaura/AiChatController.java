package com.gangstaneli.mindaura;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/api/ai-chat")
@CrossOrigin(origins = "*")
public class AiChatController {

    private static final String OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;

    public AiChatController(
            ObjectMapper objectMapper,
            @Value("${openai.api.key:}") String apiKey,
            @Value("${openai.model:gpt-5.5}") String model
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
        this.apiKey = apiKey;
        this.model = model;
    }

    @PostMapping
    public AiChatResponse chat(@RequestBody AiChatRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "OPENAI_API_KEY is missing. Set it before starting the backend."
            );
        }

        if (request.message() == null || request.message().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message is required.");
        }

        try {
            String body = createOpenAiRequestBody(request);
            HttpRequest openAiRequest = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_RESPONSES_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(openAiRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "OpenAI request failed with status " + response.statusCode()
                );
            }

            return new AiChatResponse(extractText(response.body()));
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "OpenAI response could not be read.", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "OpenAI request was interrupted.", exception);
        }
    }

    private String createOpenAiRequestBody(AiChatRequest request) throws IOException {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", model);
        root.put("max_output_tokens", 450);

        ArrayNode input = root.putArray("input");
        input.add(messageNode(
                "developer",
                "You are MindAura, a warm mental wellness chat assistant. Help users talk through what is going on. " +
                        "Be supportive, concise, practical, and nonjudgmental. Do not diagnose. If the user may be in " +
                        "immediate danger or mentions self-harm, tell them to call 988 in the U.S. or local emergency services."
        ));

        if (request.messages() != null) {
            request.messages().stream()
                    .filter(message -> message.text() != null && !message.text().isBlank())
                    .limit(12)
                    .forEach(message -> input.add(messageNode(toOpenAiRole(message.sender()), message.text())));
        }

        input.add(messageNode("user", request.message()));
        return objectMapper.writeValueAsString(root);
    }

    private ObjectNode messageNode(String role, String text) {
        ObjectNode message = objectMapper.createObjectNode();
        message.put("role", role);

        ArrayNode content = message.putArray("content");
        ObjectNode textPart = content.addObject();
        textPart.put("type", "input_text");
        textPart.put("text", text);

        return message;
    }

    private String toOpenAiRole(String sender) {
        return "ai".equals(sender) ? "assistant" : "user";
    }

    private String extractText(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode outputText = root.get("output_text");

        if (outputText != null && outputText.isTextual()) {
            return outputText.asText();
        }

        StringBuilder text = new StringBuilder();
        collectOutputText(root, text);

        if (text.isEmpty()) {
            return "I am here with you, but I could not read the AI response. Try sending that again.";
        }

        return text.toString().trim();
    }

    private void collectOutputText(JsonNode node, StringBuilder text) {
        if (node == null) {
            return;
        }

        if (node.isObject() && "output_text".equals(node.path("type").asText()) && node.has("text")) {
            text.append(node.get("text").asText()).append("\n");
        }

        node.forEach(child -> collectOutputText(child, text));
    }

    public record AiChatRequest(String message, List<AiChatMessage> messages) {
    }

    public record AiChatMessage(String sender, String text) {
    }

    public record AiChatResponse(String reply) {
    }
}
