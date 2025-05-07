require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongoose: {
        url: process.env.MONGODB_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjliYjM2YzZjMmRlNGRmZWUwMjI2ZiIsInJvbGUiOiJ0ZWNobmljaWFuIiwiaWF0IjoxNzQ0NDIwMTkxLCJleHAiOjE3NDQ1MDY1OTF9.w_EbR-C4bRHa2JBxgR2Xi_mHNqd_J9u0N8FaLWiYg-A',
        accessExpirationMinutes: process.env.JWT_EXPIRATION_MINUTES || 1440 // 24 hours
    }
};