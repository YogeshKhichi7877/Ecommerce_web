const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'https://yogeshkhichi7877.github.io',
  credentials: true // Allow cookies/headers if needed
}));;
require('dotenv').config();

const nodemailer = require('nodemailer');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY );

const Products = require('./models/products.js');
const User = require('./models/user.js');
//const User = require('./models/user');
const db = require('./db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors());


// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
const logRequest = (req, res, next) => {
  console.log(`${new Date().toLocaleString()} Request made to: ${req.originalUrl}`);
  next();
};

app.use(logRequest);


// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww


// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

// Middleware to verify JWT token and attach user to req
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token,"Yogesh_7877" , (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });
    req.user = user; // user contains userId and email
    next();
  });
}

// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww


// Configure nodemailer (using Gmail for example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yogeshkhinchi2005@gmail.com',
    pass: 'qprw bcan pycj vadj' 
  },
  debug: true,
  logger: true
});

const LOW_STOCK_THRESHOLD = 5; // Alert if stock <= 5

// Function to check and alert for low stock
async function checkLowStockAndAlert() {
  // const { company , stock } = req.body;
const lowStockProducts = await Products.find({ stock: { $lte: LOW_STOCK_THRESHOLD } });

const adminEmail = 'ykhinchi38@gmail.com';
lowStockProducts.forEach(product => {
  transporter.sendMail({
    from: 'yogeshkhinchi2005@gmail.com',
    to: adminEmail,
    subject: `Low Stock Alert: ${product.company}`,
    text: `Stock for ${product.company} is low: Only ${product.stock} left in your godown.`
  },);
});}


// You can call this function periodically or after each stock change
setInterval(checkLowStockAndAlert, 1000 * 60 * 60); // every hour

app.get('/api/low-stock-products', async (req, res) => {
  const products = await Products.find({ stock: { $lte: LOW_STOCK_THRESHOLD } });
  res.json(products);
});

// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
// async function sendProductEmail(action, product) {
//   const mailOptions = {
//     from: 'yogeshkhinchi2005@gmail.com',
//     to: 'ykhinchi38@gmail.com',
//     subject: `Product ${action}: ${product.company || product.model}`,
//     text: `The product ${product.company || product.name} (${product.model}) has been ${action}. \n \n Full Details: ${JSON.stringify(product)}`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

async function sendProductEmail(action, product , old_price = null, old_stock = null) {
  
  const subject = `Product ${action}: ${product.company || product.name}`;
  let text = `
    Product ${action} Notification
    ------------------------------
    Company: ${product.company}
    Model: ${product.model}
    Price: ${product.price}
    Stock: ${product.stock}

    ------------------------------------
   }
  `;
  if (old_price !== null && old_stock !== null) {
    text = `
    Product ${action} Notification
    ------------------------------
    Company: ${product.company}
    Model: ${product.model}
    Price: ${product.price}
    Stock: ${product.stock}
    ------------------------------------
    
    Data before update : 
    Old Price: ${old_price}
    Old Stock: ${old_stock}

    ------------------------------------
   }
    `;
  }

  const msg = {
    to:'yogeshkhinchi2005@gmail.com', // Replace with your recipient
    from: 'yogeshkhinchi03@gmail.com', // Use your verified sender email
    subject: subject,
    text: text
    // You can also use 'html' for formatted emails
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent for ${action} action`);
  } catch (error) {
    console.error(`Error sending ${action} email:`, error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}


async function sendDeleteEmail(action, product) {
  
  const subject = `Product ${action}: ${product.company || product.name}`;
  let text2 = `
    Product ${action} Delete Notification
    ------------------------------
    Company: ${product.company}
    Model: ${product.model}
    Details: ${product.details}
    Price: ${product.price}
    Stock: ${product.stock}

    ------------------------------------
    'This product has been removed from inventory.\n \n' Contact your admin for further details .}
  `;
  
  const msg = {
    to:'yogeshkhinchi2005@gmail.com', // Replace with your recipient
    from: 'yogeshkhinchi03@gmail.com', // Use your verified sender email
    subject: subject,
    text: text2
    // You can also use 'html' for formatted emails
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent for DELETE action`);
  } catch (error) {
    console.error(`Error sending DELETE email:`, error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}



// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

app.get('/download/inventory/csv', async (req, res) => {
  try {
    const products = await Products.find();
    const fields = ['company', 'model' , 'price', 'stock'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('inventory_report.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).send('Failed to generate CSV');
  }
});


app.get('/download/inventory/excel', async (req, res) => {
  try {
    const products = await Products.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

 worksheet.columns = [
  { header: 'Company', key: 'company', width: 30 },
  { header: 'Model', key: 'model', width: 10 },
  { header: 'Price', key: 'price', width: 15 },
  { header: 'Stock', key: 'stock', width: 20 }
];

products.forEach(product => {
  worksheet.addRow({
    company: product.company,
    model: product.model,
    price: product.price,
    stock: product.stock,
  });
});
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).send('Failed to generate Excel');
  }
});




app.get('/download/inventory/pdf', async (req, res) => {
  const products = await Products.find();
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Inventory Report', { align: 'center' });
  doc.moveDown();

  products.forEach(product => {
    doc.fontSize(12).text(
      `Company (Name): ${product.company} | Stock: ${product.stock} | Price: ${product.price}`
    );
    doc.moveDown(0.5);
  });

  doc.end();
});


// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

const Private_key = process.env.PRIVATE_KEY ;
app.post('/signup', async (req, res) => {
  try {
    const { shopname, ownername, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      shopname,
      ownername,
      password: hashed,
      email
    });
    await user.save();
    // const token = jwt.sign({ shopname, ownername, email }, Private_key);
    
    res.status(201).json(user);
  } catch (err) {
    console.log("Signup Error:", err);
    res.status(400).json({ error: err.message });
  }
});

// -------------------- Login --------------------
app.post('/Login', async (req, res) => {
 try {
    // console.log('Login request:', req.body); // Debug
    const user = await User.findOne({ password : req.body.password });
    if (!user) {
      return res.status(401).json({ error: "invalid ownername or password" });
    }
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        console.log("bcrypt error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!isMatch) {
        return res.status(401).json({ error: "invalid username or password" });
      }else {
        //  res.send(user);
         console.log("yeeeaah , you loged in :)");
      }
    });
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "Yogesh_7877",
      { expiresIn: '24h' }
    );
    // res.cookie("token", token);
   res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    alert(err);
    res.status(401).json({ message: "Invalid credentials"});
  }
});

// app.get('/user',  async (req, res) => {
//   try {
//     // For demo: get user by query param ?ownername=foo
//     const ownername = req.query.ownername;
//     if (!ownername) return res.status(400).json({ error: 'ownername required' });
//     const user = await User.findOne({ ownername }).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });



app.post('/products', authenticateToken, async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    const { company, model , details, price, stock } = req.body;
     if (!company || !model || !details || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const product = await Products.create({
      company,
      model,
      details,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      owner: req.user.userId // <--- THIS IS IMPORTANT!
    });
    await product.save();
    await sendProductEmail('added', product);
    res.status(200);
    res.send(product);
    console.log('Product created:', product);
    if(!product){
      console.log("error ocureed");
    }
  } catch (err) {
     console.log("Product Create Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});


// -------------------- Get All Products --------------------
app.get('/product', authenticateToken,async (req, res) => {
  try {
    const products = await Products.find({ owner: req.user.userId });
    res.status(200).json(products);
  } catch (err) {
    console.log("Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Update Product by Type --------------------
// Add this PUT route to your backend
app.put('/products/:id',  authenticateToken ,async (req, res) => {
  try {
    const { id } = req.params;
    const { company, model, details, price, stock } = req.body;
    
    // Validate required fields
    if (!company || !model || !details || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    //new code
    const product = await Products.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
     if (product.owner.toString() !== req.user.userId) {
     res.status(403).json({ message: 'Forbidden: You do not own this product' });
     }

    // data before update : 
    let oldProduct = await Products.findById(req.params.id);
    let old_price = oldProduct.price;
    let old_stock = oldProduct.stock;    
    
    // Update the product
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { company, model, details, price, stock },
      { new: true, runValidators: true }
    );
      if (updatedProduct.stock <= 1) {
    // send email here
    transporter.sendMail({
      from: 'yogeshkhinchi2005@gmail.com',
      to: 'ykhinchi38@gmail.com',
      subject: `Low Stock Alert: ${updatedProduct.company}`,
      text: `Stock for ${updatedProduct.company} is low: Only ${updatedProduct.stock} left. Please RESTOCK it as soon as possible`
    });
  }
     if (updatedProduct) {
    await sendProductEmail('updated', updatedProduct, old_price, old_stock);

  }
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// -------------------- Delete Product by Type --------------------
app.delete('/products/:id', authenticateToken , async (req, res) => {
  try {
    const { id } = req.params;

    //new code
    const product = await Products.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

     if (product.owner.toString() !== req.user.userId) {
     res.status(403).json({ message: 'Forbidden: You do not own this product' });
     }
    const deletedProduct = await Products.findByIdAndDelete(id);
 
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (deletedProduct) {
    await sendDeleteEmail('deleted', deletedProduct);
  }
  res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

app.listen(5000, () => {
  console.log(`Server running at https://ecommerce-bomr.onrender.com`);
});