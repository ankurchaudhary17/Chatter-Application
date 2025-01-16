
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
      try {
        const loggedInUserId = req.user._id;//give me the logged in user id;

        //by filtering find the all the user which id is not equal to the current user id,and not fetch password
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    
        res.status(200).json(filteredUsers);
      } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    };
    export const getMessages = async (req, res) => {
      try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
    
//find the aall the message where either i am the send or other user is sender
        const messages = await Message.find({
          $or: [
            { senderId: myId, receiverId: userToChatId },//sender id is my is and reciver id is the user to chat
            { senderId: userToChatId, receiverId: myId },//reciver id is my is and the sender id id the user to chat
          ],
        });
    
        res.status(200).json(messages);//send the message
      } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    };

    export const sendMessage = async (req, res) => {
      try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
    
        let imageUrl;
        if (image) {
          // Upload base64 image to cloudinary
          const uploadResponse = await cloudinary.uploader.upload(image);
          imageUrl = uploadResponse.secure_url;
        }
    
        const newMessage = new Message({
          senderId,
          receiverId,
          text,
          image: imageUrl,
        });
    
        await newMessage.save();
    

        //realtime functionality goes here==>socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);//emit the newmessage event to the reciver user 
        }
    
        res.status(201).json(newMessage);
      } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    };