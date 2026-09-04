package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.domain.OrderStatus;
import com.phynahairs.ecommerce.domain.PaymentMethod;
import com.phynahairs.ecommerce.domain.PaymentStatus;
import com.phynahairs.ecommerce.exception.OrderException;
import com.phynahairs.ecommerce.model.Order;
import com.phynahairs.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlutterwaveService {

    @Value("${flutterwave.secret-key}")
    private String secretKey;

    @Value("${flutterwave.redirect-url:http://localhost:3000/payment/callback}")
    private String redirectUrl;

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String FLUTTERWAVE_PAYMENT_URL = "https://api.flutterwave.com/v3/payments";
    private static final String FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions/";

    public String createPaymentLink(Order order, PaymentMethod paymentMethod) {

        String paymentOptions = mapPaymentMethodToFlwOption(paymentMethod);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(secretKey);

        Map<String, Object> customerMap = new HashMap<>();
        customerMap.put("email", order.getUser().getEmail());
        customerMap.put("name", order.getUser().getFirstName() + " " + order.getUser().getLastName());
        customerMap.put("phonenumber", order.getUser().getMobile() != null ? order.getUser().getMobile() : "08000000000");

        Map<String, Object> customizationMap = new HashMap<>();
        customizationMap.put("title", "Phyna Hairs & Beauty Salon");
        customizationMap.put("description", "Payment for Order #" + order.getOrderId());

        // FIX: Append timestamp so tx_ref is ALWAYS unique for Flutterwave
        String uniqueTxRef = order.getOrderId() + "_" + System.currentTimeMillis();

        Map<String, Object> payload = new HashMap<>();
        payload.put("tx_ref", uniqueTxRef);

        BigDecimal amountToPay = (order.getTotalDiscountedPrice() != null && order.getTotalDiscountedPrice().compareTo(BigDecimal.ZERO) > 0)
                ? order.getTotalDiscountedPrice()
                : order.getTotalPrice();

        payload.put("amount", (amountToPay != null) ? amountToPay.toString() : "1000");
        payload.put("currency", "NGN");
        payload.put("redirect_url", redirectUrl);
        payload.put("payment_options", paymentOptions);
        payload.put("customer", customerMap);
        payload.put("customizations", customizationMap);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(FLUTTERWAVE_PAYMENT_URL, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map body = response.getBody();
            if ("success".equalsIgnoreCase((String) body.get("status"))) {
                Map data = (Map) body.get("data");

                order.getPaymentDetails().setTxRef(uniqueTxRef);
                order.getPaymentDetails().setPaymentMethod(paymentMethod);
                order.getPaymentDetails().setStatus(PaymentStatus.PROCESSING);
                orderRepository.save(order);

                return (String) data.get("link");
            }
        }

        throw new RuntimeException("Failed to initialize payment link with Flutterwave");
    }

    public boolean verifyTransaction(String transactionId, String txRef) throws OrderException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(secretKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String verifyUrl = FLUTTERWAVE_VERIFY_URL + transactionId + "/verify";
            ResponseEntity<Map> response = restTemplate.exchange(verifyUrl, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map body = response.getBody();
                if ("success".equalsIgnoreCase((String) body.get("status"))) {
                    Map data = (Map) body.get("data");

                    String status = (String) data.get("status");
                    String flwTxRef = (String) data.get("tx_ref");
                    String flwRef = (String) data.get("flw_ref");

                    if ("successful".equalsIgnoreCase(status)) {
                        String baseOrderId = (flwTxRef != null && flwTxRef.contains("_")) ? flwTxRef.split("_")[0] : flwTxRef;
                        Order order = orderRepository.findByOrderId(baseOrderId);

                        if (order == null && txRef != null) {
                            String altOrderId = txRef.contains("_") ? txRef.split("_")[0] : txRef;
                            order = orderRepository.findByOrderId(altOrderId);
                        }

                        if (order != null) {
                            order.setOrderStatus(OrderStatus.CONFIRMED);
                            order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
                            order.getPaymentDetails().setFlwRef(flwRef);
                            order.getPaymentDetails().setTransactionId(transactionId);
                            orderRepository.save(order);
                            return true;
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println(">>> Flutterwave transaction verification error: " + e.getMessage());
        }
        return false;
    }

    private String mapPaymentMethodToFlwOption(PaymentMethod method) {
        if (method == null) return "card,banktransfer,ussd";
        switch (method) {
            case CARD: return "card";
            case BANK_TRANSFER: return "banktransfer";
            case USSD: return "ussd";
            case MOBILE_MONEY: return "mobilemoney";
            default: return "card,banktransfer,ussd,mobilemoney";
        }
    }
}