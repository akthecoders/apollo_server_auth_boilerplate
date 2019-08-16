const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const UserSchema = require('../MongoSchema/UserSchema');

class User {
  async authenticateUser(email, password) {
    try {
      let user = await UserSchema.findOne({ email });
      if (!user) return { errors: [{ msg: 'Invalid Credentials' }] };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { errors: [{ msg: 'Invalid Credentials' }] };

      const payload = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 360000
      });
      return token;
    } catch (error) {
      console.error(err.message);
      return { errors: [{ msg: 'Server Error' }] };
    }
  }

  getUserViaToken(token) {
    if (!token) return '';
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      return decoded.user.id;
    } catch (err) {
      return '';
    }
  }

  async getUserDetails(id) {
    try {
      const user = await UserSchema.findOne({ _id: id }).select('-password');
      return user;
    } catch (error) {
      console.error(error.message);
      return {};
    }
  }

  async deleteUser(id) {
    try {
      const user = await UserSchema.findOne({ _id: id }).select('-password');
      await UserSchema.deleteOne({ _id: id });
      return user;
    } catch (error) {
      console.error(error.message);
      return {};
    }
  }

  async registerUser({ name, email, password, company }) {
    try {
      let user = new UserSchema({
        name,
        email,
        password,
        company
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      const token = await jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 360000
      });
      return token;
    } catch (error) {
      console.log(error.message);
      return '';
    }
  }
}

module.exports = User;
