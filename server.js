import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import './config/cloudinary.js';
import UserRouter from './routes/UserRoute.js';
import BlogRouter from './routes/BlogRoute.js';
import CollectionRouter from './routes/CollectionRoute.js';

// import propertyrouter from './routes/propertyRoute.js';
// import cron from 'node-cron';

const app = express();
const port = process.env.PORT;

connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/user',UserRouter);
app.use('/api/blog',BlogRouter );
app.use('/api/collection',CollectionRouter)



app.get('/', (req, res) => {
  res.send('API RUNNING');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


