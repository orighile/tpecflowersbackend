import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import './config/cloudinary.js';
import UserRouter from './routes/UserRoute.js';
import BlogRouter from './routes/BlogRoute.js';
import CollectionRouter from './routes/CollectionRoute.js';
import { sendContactMail } from './config/smtp.js'; // ✅ ADD

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

// Existing routes
app.use('/api/user', UserRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/collection', CollectionRouter);

// ✅ NEW CONTACT ROUTE
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await sendContactMail({ name, email, message });
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('SMTP ERROR:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.get('/', (req, res) => {
  res.send('API RUNNING');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
