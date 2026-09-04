package com.phynahairs.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;


     // Uploads a single file (e.g. main wig cover photo) to Cloudinary

    public Map<String, String> uploadImage(MultipartFile file, String folderName) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "phynahairs/" + (folderName != null ? folderName : "products"),
                "resource_type", "auto"
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", uploadResult.get("secure_url").toString());
        response.put("publicId", uploadResult.get("public_id").toString());

        return response;
    }


     // Deletes an image from Cloudinary using its publicId

    public Map deleteImage(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}