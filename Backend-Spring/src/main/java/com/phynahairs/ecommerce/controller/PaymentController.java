package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.domain.PaymentMethod;
import com.phynahairs.ecommerce.exception.OrderException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Order;
import com.phynahairs.ecommerce.response.ApiResponse;
import com.phynahairs.ecommerce.service.FlutterwaveService;
import com.phynahairs.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final FlutterwaveService flutterwaveService;

    // 1. Generate Flutterwave Payment Link
    @PostMapping("/flutterwave/{orderId}")
    public ResponseEntity<Map<String, Object>> createFlutterwavePaymentLink(
            @PathVariable Long orderId,
            @RequestParam(defaultValue = "FLUTTERWAVE") PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt) throws OrderException, UserException {

        Order order = orderService.findOrderById(orderId);
        String paymentLink = flutterwaveService.createPaymentLink(order, paymentMethod);

        Map<String, Object> response = new HashMap<>();
        response.put("payment_url", paymentLink);
        response.put("order_id", order.getOrderId());
        response.put("status", true);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. Callback Endpoint to Verify Flutterwave Payment
    @GetMapping("/flutterwave/callback")
    public ResponseEntity<ApiResponse> flutterwaveCallback(
            @RequestParam("status") String status,
            @RequestParam("tx_ref") String txRef,
            @RequestParam("transaction_id") String transactionId) throws OrderException {

        boolean isVerified = flutterwaveService.verifyTransaction(transactionId, txRef);

        if (isVerified) {
            ApiResponse res = new ApiResponse("Payment verified successfully via Flutterwave", true);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        ApiResponse res = new ApiResponse("Payment verification failed", false);
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
}