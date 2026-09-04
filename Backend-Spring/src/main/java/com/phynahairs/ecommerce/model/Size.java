package com.phynahairs.ecommerce.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Size {
    private String name; // e.g. "20 inches", "Medium Cap"
    private int quantity;

}