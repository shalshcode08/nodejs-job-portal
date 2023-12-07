//package imports
import express from 'express';
// API Documentation
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from "swagger-jsdoc";
import dotenv from 'dotenv';
import "express-async-errors";
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
//security packages
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
//file imports
import connectDB from './config/db.js'
//routes import
import testRoutes from './routes/testRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorMiddelware from './middelwares/errorMiddelware.js';
import jobsRoutes from './routes/jobsRoutes.js'
import userRoutes from './routes/userRoutes.js';

//DOTENV config
dotenv.config();


//mongodb connection
connectDB();

// swagger API config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal Application",
            description: "Node Expressjs Job Portal Application",
        },
        servers: [
            {
                url: "https://nodejs-job-portal-ymd1.onrender.com"
                // url: "https://nodejs-job-portal-app.onrender.com"
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);


const app = express();

//middelware
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation middelware
app.use(errorMiddelware);

//PORT
const PORT = process.env.PORT || 8080

//listen
app.listen(8080, () => {
    console.log(`Node Server Running in ${process.env.DEV_MODE} mode on PORT no ${PORT}`.bgCyan);
})
