import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const employeeSchema = new mongoose.Schema({
    dealAyoId: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    decreaseTask: {
        type: Number,
        required: true,
        default: 0,
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    profilePicPath: {
        type: String
    },
    tokens: [
        {
            token: {
                type: String,
                // required: true,
            }
        }
    ]
});

//middleWare.  we have also post method
employeeSchema.pre('save', async function (next) {
    //we will not hash password at time of update, it is hashed only at time new user created
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next()
})

//generating token
employeeSchema.methods.generateAuthToken = async function (req, res) {
    try {
        let token = jwt.sign({
            _id: this._id,
            dealAyoId: this.dealAyoId,
            name: this.firstName,
            role: this.role,
            profilePicPath: this.profilePicPath
        },
            process.env.SECRET_KEY
        );
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token
    } catch (err) {
        res.status(500).send('Error occured while generating token')
    }
}

export default mongoose.models.employees || mongoose.model('employees', employeeSchema);
