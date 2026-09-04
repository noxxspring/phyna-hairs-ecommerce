package com.phynahairs.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal discountedPrice;
    private Integer discountedPercent;
    private Integer quantity;
    private String brand;
    private String color;

    // ==========================================
    // WIG & BEAUTY SALON SPECIFIC FIELDS
    // ==========================================
    private String hairType;        // Virgin Human Hair, Raw Hair, Synthetic
    private String hairTexture;     // Straight, Body Wave, Deep Wave, Kinky Curly
    private String laceType;        // 13x4 Frontal, 4x4 Closure, 13x6 Frontal, Glueless, 360
    private Integer lengthInInches; // 12, 14, 18, 24, 30
    private String density;         // 150%, 180%, 200%
    private String capSize;         // Small, Medium, Large

    private boolean prePlucked;
    private boolean knotsBleached;
    private boolean glueless;
    private boolean isSalonService; // True if product is a service (e.g. Wig Installation / Custom Coloring)

    // ==========================================
    // CLOUDINARY MEDIA
    // ==========================================
    @Column(name = "image_url")
    private String image; // Main Cloudinary URL

    private String imagePublicId; // Cloudinary Public ID for deletion

    @ElementCollection
    @CollectionTable(name = "product_gallery_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "gallery_image_url")
    private List<String> galleryUrls = new ArrayList<>();

    @Embedded
    @ElementCollection
    @Column(name = "sizes")
    private Set<Size> sizes = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @Column(name = "num_ratings")
    private int numRatings;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDateTime createdAt;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean productAvailable = true;


}