const { Router, response, request } = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcript = require('bcryptjs');
const router = Router();

// /api/auth
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Incorrect password, 6 symbols please').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      //валидация
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data',
        });
      }
      //логика регистрации
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      //если пользователь зареган
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'This user is already registered' });
      }

      //хэширование
      const hashedPassword = await bcript.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Something wrong with register' });
    }
  },
);

// /api/auth
router.post(
  '/login',
  [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Incorrect password, 6 symbols please')
      .exists()
      .isLength({
        min: 6,
      }),
  ],
  async (req, res) => {
    try {
      //валидация
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect authorization data',
        });
      }

      //создание пользователя

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      //проверка на совпадение паролей

      const isMatch = await bcript.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      //создание токена
      //что шифровать, секретный ключ, через сколько токен пропадет
      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: 'Something wrong with auth' });
    }
  },
);

module.exports = router;
