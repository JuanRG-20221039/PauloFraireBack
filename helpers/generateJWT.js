import jwt from "jsonwebtoken";

const generateJWT = (id) => {
    const secretKey = "asdASDqweQWE123";

    return jwt.sign({ id }, secretKey, {
        expiresIn: "30d",
    });
}

export default generateJWT;
