const express = require('express');
const app = express();
const cors = require('cors');
const fileupload = require("express-fileupload");
const fetchAdmin = require('./middleware/fetchadmin');
const connectToMongo = require('./db');
const adminrouter = require('./routes/auth');
const homerouter = require ('./routes/homeRoutes')
const footerrouter = require('./routes/footerRoutes');
const metaRoutes = require('./routes/metaRoutes');
const dishrouter = require('./routes/dishRoutes');
const Productviewrouter = require('./routes/productviewRoutes');
const dishviewrouter = require('./routes/dishviewRoutes');
const productRouter = require('./routes/productRoutes');
const contactrouter = require('./routes/contactRoutes');
app.use(express.json());
app.use(cors());
connectToMongo()
  .then(() => {
    console.log('✅ MongoDB connected, starting server...');
   app.use("/api/auth", adminrouter);
   app.use('/api/footer', footerrouter);
   app.use('/api', metaRoutes);
app.use("/api/dishes", dishrouter);      
  app.use("/api/removedishes", dishviewrouter);
   app.use("/api/products", productRouter);
   app.use("/api/removeproduct", Productviewrouter);
   app.use("/api/contact", contactrouter);
   app.use("/api/home", homerouter);

   app.get('/api/auth/admininfo', fetchAdmin, (req, res) => {
     res.json({ msg: "This is protected admin info.", adminId: req.user });
   });
    const port = 8000;
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); 
  });
