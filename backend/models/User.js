import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Mongoose schema definition for the User model.
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * The full name of the user.
     * Must be between 2 and 50 characters long and will be trimmed.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    /**
     * The unique email address of the user.
     * Will be converted to lowercase, trimmed, and validated against standard email format.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address',
      ],
    },
    /**
     * Hashed password of the user.
     * Must be at least 6 characters before hashing.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    /**
     * The security and access control role of the user.
     * Defaults to 'user', can be escalated to 'admin'.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user',
      },
      default: 'user',
    },
    /**
     * Denotes whether the user account is active.
     * Allows soft disabling of user accounts.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to automatically hash the user's password.
 * This runs before any `save` operations, checking if the password field was modified.
 */
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare a candidate plain-text password with the stored hashed password.
 * @param {string} candidatePassword - The plain text password to compare.
 * @returns {Promise<boolean>} Resolves to true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Overrides the toJSON method to ensure the sensitive password field is
 * never returned in the JSON payload sent to the client.
 * @returns {Object} The user object without the password property.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export { userSchema };
export default User;
