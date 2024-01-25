const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Consider loading the JWT secret key from environment variables for security
const jwtSecretKey = (process.env.JWT_SECRET_KEY);

async function signUp(name, email, password, bio) {
    const hashedPassword = await argon2.hash(password);
    console.log(name, email, password, bio);
    try {
        console.log(email)

        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                bio: bio,
                password: hashedPassword,
            },
        });

        const token = await generateToken();
        console.log(token)
        return {
            "id" : user.id,
            "token" : token,
        };
    } catch (error) {
        console.log(error)
        if (error && error.code === 'P2002') {
            // Unique constraint violation (email already exists)
            return 'Email address is already in use.';
        } else {
            // Handle other errors
            throw error;
        }
    }
}
  
async function signIn(email, password) {
 
    const user = await prisma.user.findUnique({
        where: {
            email: email, // Add this line to specify the email
        },
    });

    if (user && (await argon2.verify(user.password, password))) {
        const token = await generateToken(user.id);
        return {
            "id" : user.id,
            "token" : token,
        };
    } else {
        return "Invalid email or password";
    }
}

async function generateToken(id) {
    const data = {
        time: Date(),
        userId: id,
    };

    const token =  jwt.sign(data, jwtSecretKey);
    return token;
}

module.exports = { signUp, signIn };
