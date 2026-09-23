package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Product;
import com.phynahairs.ecommerce.repository.ProductRepository;
import com.phynahairs.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @GetMapping({"", "/"})
    public ResponseEntity<Page<Product>> findProductByCategoryHandler(
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false) List<String> color,
            @RequestParam(required = false) List<String> size,
            @RequestParam(required = false, defaultValue = "0") Integer minPrice,
            @RequestParam(required = false, defaultValue = "1000000") Integer maxPrice,
            @RequestParam(required = false, defaultValue = "0") Integer minDiscount,
            @RequestParam(required = false, defaultValue = "price_low") String sort,
            @RequestParam(required = false, defaultValue = "") String stock,
            @RequestParam(required = false, defaultValue = "0") Integer pageNumber,
            @RequestParam(required = false, defaultValue = "100") Integer pageSize
    ) {
        Page<Product> res = productService.getAllProduct(
                category, color, size, minPrice, maxPrice,
                minDiscount, sort, stock, pageNumber, pageSize
        );
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
    
    @GetMapping("/id/{productId}")
    public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException {
        Product product = productService.findProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.ACCEPTED);
    }

    // Get all products inside a specific Category ID (e.g. Category ID 5 for "Hair Accessories")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> findProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }



    @GetMapping("/new-arrivals")
    public ResponseEntity<List<Product>> getNewArrivalsHandler() {
        List<Product> products = productService.getNewArrivals();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<Product>> getBestSellersHandler() {
        List<Product> products = productService.getBestSellers();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductHandler(@RequestParam("q") String query) {
        List<Product> products = productService.searchProduct(query);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}