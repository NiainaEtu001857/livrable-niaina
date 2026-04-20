const express = require('express');
const app = express();
const cors = require('cors');

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

require("dotenv").config({ quiet: true });

// 👉 DB (Prisma / PostgreSQL)
const { connectDB } = require("./config/db");

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfOutputDir = path.resolve(__dirname, '..', process.env.PDF_OUTPUT_DIR || 'storage/pdfs');
async function start() {
  await mkdir(pdfOutputDir, { recursive: true });

  app.listen(port, () => {
    console.log(`Succession PDF service listening on port ${port}`);
  });
}


const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// =========================
// CORS CONFIG
// =========================
const corsOptions = {
  origin: process.env.ORIGIN || "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
// ====================app.options(/.*/, cors(corsOptions));=====
// MIDDLEWARES
// =========================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// =========================
// VIEW ENGINE
// =========================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// =========================
// ROUTES
// =========================
const authRoutes = require('./routes/auth.router');
const wizardRoutes = require('./routes/wizard.router');

app.use('/auth', authRoutes);
app.use('/wizard', wizardRoutes);
app.use('/api/pdf_laud', require('./routes/succession.router'));

// =========================
// 404 HANDLER
// =========================
app.use((req, res, next) => {
  next(createError(404));
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error"
  });
});

module.exports = app;