import User from "../models/User.js";
import bcrypt from 'bcrypt';
import generateJWT from "../helpers/generateJWT.js";

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get user by id
const getUserById = async (req, res) => {

    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const user = await User.findById(id);

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        res.json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//login

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            const error = new Error('Contraseña incorrecta');
            return res.status(400).json(error.message);
        }
        const token = generateJWT(user.id);


        const payload = {
            user: {
                id: user.id,
                name: `${user.name} ${user.lastName}`,
                email: user.email,
                token: token,
                role: user.role,
            },
        };


        res.json(payload);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


//create user

const addUser = async (req, res) => {

    const { name, lastName, email, password } = req.body;

    try {
        if (!name || !lastName || !email || !password) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            const error = new Error('El usuario ya existe');
            return res.status(400).json(error.message);
        }

        const user = new User({
            name,
            lastName,
            email,
            password
        });


        user.password = await bcrypt.hashSync(password, 10);

        await user.save();

        res.json({ message: 'Usuario creado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//update user

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, email, password } = req.body;

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        if (!name || !lastName || !email || !password) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const user = await User.findById(id);

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.password = bcrypt.hashSync(password, 10);

        await user.save();

        res.json({ message: 'Usuario actualizado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


//delete user 

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {

        if (!id) {
            const error = new Error('ID requerido');
            return res.status(400).json(error.message);
        }

        const userExist = await User.findById(id);

        if (!userExist) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        await User.findByIdAndDelete(id);

        res.json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    login
}