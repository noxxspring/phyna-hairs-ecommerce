package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.exception.UserException;

public interface UserService {
    public User findUserById(Long userId)throws UserException;
//    public User findUserByJwt(String jwt)throws UserException;

    User findUserProfileByJwt(String jwt) throws UserException;
}
