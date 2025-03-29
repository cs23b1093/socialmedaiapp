import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json(limit= '10kb'));
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credential: true,
    maxAge: 600,
}))

app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send(`
        <div style="
          display: flex; 
          border-radius: 50px;
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          background-color:rgb(28, 33, 37); /* Light background */
          margin: 0;
        ">
          <div style="
            padding: 20px 40px; 
            border: 3px solidrgb(227, 231, 26); 
            border-radius: 15px; 
            box-shadow: 0 4px 8px rgba(206, 64, 64, 0.2); 
            background-color: white; 
            text-align: center;
            border-radius: 50px;
            transition: transform 0.3s, box-shadow 0.3s; /* Smooth transitions */
          " 
          onmouseover="this.style.boxShadow='0 8px 20px rgba(0, 123, 255, 0.6)'; this.style.transform='scale(1.05)';" 
          onmouseout="this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'; this.style.transform='scale(1)';">
            <h1 style="
              color: #007BFF; 
              font-family: Arial, sans-serif; 
              font-size: 2rem; 
              margin: 0;
            ">
              Server is running
            </h1>
          </div>
        </div>
      `);
});

import router from '../src/routes/user.router.js'

app.use('/api/v1/users', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})