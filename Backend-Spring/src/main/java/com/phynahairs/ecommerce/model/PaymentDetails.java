package com.phynahairs.ecommerce.model;

import com.phynahairs.ecommerce.domain.PaymentMethod;
import com.phynahairs.ecommerce.domain.PaymentStatus;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {

	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentMethod;

	@Enumerated(EnumType.STRING)
	private PaymentStatus status;

	// Flutterwave Specific Fields
	private String txRef;           // Merchant transaction reference (e.g., PHYNA-TX-10293)
	private String flwRef;          // Flutterwave transaction reference
	private String transactionId;   // Flutterwave payment numeric ID
	private String currency;        // e.g. "NGN", "USD", "GHS"

}