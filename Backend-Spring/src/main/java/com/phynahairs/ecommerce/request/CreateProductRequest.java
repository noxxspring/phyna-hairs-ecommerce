package com.phynahairs.ecommerce.request;

import com.phynahairs.ecommerce.model.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {

	// Direct Category Assignment (e.g., Category ID for "Hair Accessories & Care")
	private Long categoryId;

	private String title;
	private String description;
	private BigDecimal price;
	private BigDecimal discountedPrice;
	private Integer discountPercent;
	private Integer quantity;
	private String brand;
	private String color;

	// Cloudinary Media
	private String imageUrl;
	private String imagePublicId;
	@Builder.Default
	private List<String> galleryUrls = new ArrayList<>();

	// Wig / Specific Product Attributes
	private String hairType;
	private String hairTexture;
	private String laceType;
	private Integer lengthInInches;
	private String density;
	private String capSize;

	private boolean prePlucked;
	private boolean knotsBleached;
	private boolean glueless;
	private boolean isSalonService;

	// Optional legacy category strings fallback
	@Builder.Default
	private Set<Size> size = new HashSet<>();

	private String topLevelCategory;
	private String secondLevelCategory;
	private String thirdLevelCategory;
}