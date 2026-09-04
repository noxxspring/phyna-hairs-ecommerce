package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.response.ApiResponse;
import com.phynahairs.ecommerce.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    // Upload single image (Explicitly specifies multipart/form-data for Swagger UI file picker)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "wigs") String folder) throws IOException {

        Map<String, String> uploadResult = cloudinaryService.uploadImage(file, folder);
        return new ResponseEntity<>(uploadResult, HttpStatus.OK);
    }

    // Delete image by Public ID
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse> deleteImage(@RequestParam("publicId") String publicId) throws IOException {
        cloudinaryService.deleteImage(publicId);
        ApiResponse res = new ApiResponse("Image deleted successfully from Cloudinary", true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}