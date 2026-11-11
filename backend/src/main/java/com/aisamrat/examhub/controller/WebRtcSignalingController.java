package com.aisamrat.examhub.controller;

import com.aisamrat.examhub.dto.WebRtcSignalDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebRtcSignalingController {

    private static final Logger log = LoggerFactory.getLogger(WebRtcSignalingController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebRtcSignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Relays WebRTC SDP offers/answers and ICE candidates between employee and proctors.
     * Destination: /app/proctoring/signal
     * Broadcasts to: /topic/proctoring/signal/{targetAttemptUuid}
     */
    @MessageMapping("/proctoring/signal")
    public void handleSignal(@Payload WebRtcSignalDto signal) {
        if (signal.targetAttemptUuid() == null) return;

        log.debug("Relaying WebRTC {} signal from {} for attempt {}",
                signal.type(), signal.senderRole(), signal.targetAttemptUuid());

        // Forward to the specific attempt's room topic
        messagingTemplate.convertAndSend(
                "/topic/proctoring/signal/" + signal.targetAttemptUuid(),
                signal
        );
    }
}

