import jwt from "jsonwebtoken";
import db from "../lib/db.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {

    // extract token from http-only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET,{
      algorithms:['HS256']
    });
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user from db
    const sql = `SELECT * FROM users WHERE user_id = ?`
    const [user] = await db.query(sql, [decoded.sub]);
    if (!user.length === 0) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }
    
    // attach user info to socket
    socket.user = user[0];
    socket.userId = user[0].user_id;


    console.log(`Socket authenticated for user with id: ${user[0].user_id}`);

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
