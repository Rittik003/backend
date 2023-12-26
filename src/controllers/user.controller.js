import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken"
// import mongoose from "mongoose";



const registerUser = asyncHandler( async (req, res) => {
    // ( get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res)

    /////////////step 1:
     
    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    /////////////step 2:

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")//will check each field and if any field is empty then throw the custom error
    ) {
        throw new ApiError(400, "All fields are required")
    }
    

    /////////////step 3:

    //user can directly call mongo db as much as it wants
    const existedUser = await User.findOne({//returns the first matched user
        $or: [{ username }, { email }]//now we can add as many fileds as i want
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    /////////////step 4:


    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    /////////////step 5:


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   
    /////////////step 6:


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })


    /////////////step 7:


    //removing password and refreshtoken from user
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    /////////////step 8:


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    /////////////step 9:
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
} )

export {registerUser}