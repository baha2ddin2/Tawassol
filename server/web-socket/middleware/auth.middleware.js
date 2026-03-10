import jwt from "jsonwebtoken";
import db from "../lib/db.js";



export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET,{
      algorithms:['HS256']
    });
    if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const sql = `SELECT * FROM users WHERE user_id = ?`
        const [user] = await db.query(sql, [decoded.sub]);
    if (!user.length === 0) return res.status(404).json({ message: "User not found" });
   
    req.user = user[0];
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
