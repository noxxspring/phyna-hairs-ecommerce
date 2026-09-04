package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Product;
import com.phynahairs.ecommerce.repository.ProductRepository;
import com.phynahairs.ecommerce.request.CreateProductRequest;
import com.phynahairs.ecommerce.response.ApiResponse;
import com.phynahairs.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    // 1. CREATE PRODUCT INSIDE A CATEGORY (Pass categoryId in JSON request body)
    @PostMapping("/")
    public ResponseEntity<Product> createProductHandler(@RequestBody CreateProductRequest req) throws ProductException {
        Product product = productService.createProduct(req);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    // 2. GET ALL PRODUCTS INSIDE A SPECIFIC CATEGORY ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategoryIdHandler(@PathVariable Long categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // 3. UPDATE PRODUCT BY ID
    @PutMapping("/{productId}/update")
    public ResponseEntity<Product> updateProductHandler(@PathVariable Long productId, @RequestBody Product req) throws ProductException {
        Product updatedProduct = productService.updateProduct(productId, req);
        return new ResponseEntity<>(updatedProduct, HttpStatus.ACCEPTED);
    }

    // 4. DELETE PRODUCT BY ID
    @DeleteMapping("/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProductHandler(@PathVariable Long productId) throws ProductException {
        productService.deleteProduct(productId);
        ApiResponse res = new ApiResponse("Product deleted successfully", true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // 5. GET ALL PRODUCTS (Admin View)
    @GetMapping("/all")
    public ResponseEntity<List<Product>> findAllProductsHandler() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}