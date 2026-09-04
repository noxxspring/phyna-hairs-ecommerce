package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Category;
import com.phynahairs.ecommerce.model.Product;
import com.phynahairs.ecommerce.repository.CategoryRepository;
import com.phynahairs.ecommerce.repository.ProductRepository;
import com.phynahairs.ecommerce.request.CreateProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImplementation implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateProductRequest req) throws ProductException {

        Category category = null;

        // 1. Direct Category Link (e.g. Nails, Hair Shampoo, Wigs)
        if (req.getCategoryId() != null) {
            category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ProductException("Category not found with id: " + req.getCategoryId()));
        }
        // 2. Fallback category string lookup
        else if (req.getTopLevelCategory() != null) {
            Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
            if (topLevel == null) {
                Category topLevelCategory = new Category();
                topLevelCategory.setName(req.getTopLevelCategory());
                topLevelCategory.setLevel(1);
                topLevel = categoryRepository.save(topLevelCategory);
            }
            category = topLevel;
        }

        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setDescription(req.getDescription());
        product.setDiscountedPrice(req.getDiscountedPrice());
        product.setDiscountedPercent(req.getDiscountPercent());

        // Cloudinary fields
        product.setImage(req.getImageUrl());
        product.setImagePublicId(req.getImagePublicId());
        if (req.getGalleryUrls() != null) {
            product.setGalleryUrls(req.getGalleryUrls());
        }

        // Product attributes
        product.setHairType(req.getHairType());
        product.setHairTexture(req.getHairTexture());
        product.setLaceType(req.getLaceType());
        product.setLengthInInches(req.getLengthInInches());
        product.setDensity(req.getDensity());
        product.setCapSize(req.getCapSize());
        product.setPrePlucked(req.isPrePlucked());
        product.setKnotsBleached(req.isKnotsBleached());
        product.setGlueless(req.isGlueless());
        product.setSalonService(req.isSalonService());

        product.setBrand(req.getBrand());
        product.setPrice(req.getPrice());
        product.setSizes(req.getSize());
        product.setQuantity(req.getQuantity());
        product.setProductAvailable(req.getQuantity() != null && req.getQuantity() > 0);
        product.setCategory(category);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    @Override
    public String deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product deleted successfully";
    }

    @Override
    public Product updateProduct(Long productId, Product req) throws ProductException {
        Product product = findProductById(productId);
        if (req.getQuantity() != null && req.getQuantity() != 0) {
            product.setQuantity(req.getQuantity());
        }
        if (req.getPrice() != null) {
            product.setPrice(req.getPrice());
        }
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product findProductById(Long id) throws ProductException {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new ProductException("Product not found with id: " + id);
    }

    @Override
    public List<Product> findProductByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProduct(String category, List<String> colour, List<String> sizes, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        List<Product> products = productRepository.filterProducts(category, minPrice, maxPrice, minDiscount, sort);

        if (colour != null && !colour.isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getColor() != null && colour.stream().anyMatch(c -> c.equalsIgnoreCase(p.getColor())))
                    .collect(Collectors.toList());
        }

        if (stock != null) {
            if (stock.equals("in_stock")) {
                products = products.stream().filter(p -> p.getQuantity() != null && p.getQuantity() > 0).collect(Collectors.toList());
            } else if (stock.equals("out_stocks")) {
                products = products.stream().filter(p -> p.getQuantity() == null || p.getQuantity() < 1).collect(Collectors.toList());
            }
        }

        int startIndex = (int) pageable.getOffset();
        int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());

        if (startIndex > products.size()) {
            return new PageImpl<>(List.of(), pageable, products.size());
        }

        List<Product> pageContent = products.subList(startIndex, endIndex);
        return new PageImpl<>(pageContent, pageable, products.size());
    }
}