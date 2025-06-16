import User from "../models/User.js";
import bcrypt from 'bcrypt';
import generateJWT from "../helpers/generateJWT.js";
import axios from 'axios';
import cloudinary from "../utils/cloudinary.js";

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get user by id
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

// Login
const login = async (req, res) => {
    const { email, password, captcha } = req.body;

    try {
        if (!email || !password || !captcha) {
            return res.status(400).json({ message: 'Todos los campos son necesarios' });
        }

        // Verificar el captcha
        const secret = '6LeHymIqAAAAAJ5GOGt1moCOYemNgb-irkCCX6s4';
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`);
        if (!response.data.success) {
            return res.status(400).json({ message: 'Captcha inválido' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comprobar si la cuenta está bloqueada
        const currentTime = new Date();
        if (user.lockUntil && user.lockUntil > currentTime) {
            const remainingTime = Math.ceil((user.lockUntil - currentTime) / 1000 / 60); // en minutos
            return res.status(403).json({ message: `Cuenta bloqueada. Intenta nuevamente en ${remainingTime} minutos.` });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            // Si se alcanzan 3 intentos fallidos, bloquear la cuenta
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(currentTime.getTime() + 10 * 60000); // Bloquear por 10 minutos
                user.loginAttempts = 0; // Reseteamos el conteo de intentos
            }

            await user.save();
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Si el inicio de sesión es exitoso, reiniciar los intentos y el bloqueo
        user.loginAttempts = 0;
        user.lockUntil = null; // Desbloquear
        await user.save();

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

// Create user
const addUser = async (req, res) => {
    const { name, lastName, email, password, role } = req.body;

    try {
        if (!name || !lastName || !email || !password || role === undefined) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            const error = new Error('El usuario ya existe');
            return res.status(400).json(error.message);
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        const user = new User({
            name,
            lastName,
            email,
            password: hashedPassword,
            old_passwords: [hashedPassword], // Guardar la contraseña en old_passwords
            role
        });

        await user.save();

        res.json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, email, password } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: 'Id requerido' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Update only provided fields
        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (email) {
            // Check if new email already exists for another user
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }
            user.email = email;
        }
        if (password) {
            // Check if password is in history
            const isInHistory = await isPasswordInHistory(user.email, password);
            if (isInHistory) {
                return res.status(400).json({ message: 'La contraseña ya ha sido utilizada anteriormente' });
            }
            user.password = bcrypt.hashSync(password, 10);
        }

        await user.save();

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Delete user 
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

// Get user by email
const getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        if (!email) {
            const error = new Error('Email requerido');
            return res.status(400).json(error.message);
        }

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json(error.message);
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Editar usuario por email
const updateUserByEmail = async (req, res) => {
    const { email } = req.params;
    const { name, lastName, password, role, newEmail } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email requerido' });
        }

        // Encontrar al usuario por su correo electrónico
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos si se proporcionan
        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (role !== undefined) user.role = role;

        // Manejar cambio de email
        if (newEmail && newEmail !== email) {
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                return res.status(400).json({ message: 'El nuevo correo electrónico ya está en uso' });
            }
            user.email = newEmail;
        }

        if (password) {
            // Verificar si la contraseña está en el historial
            const isInHistory = await isPasswordInHistory(email, password);
            if (isInHistory) {
                return res.status(400).json({ message: 'La contraseña ya ha sido utilizada anteriormente' });
            }
            user.password = bcrypt.hashSync(password, 10);
        }

        // Guardar cambios en la base de datos
        await user.save();

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

//consultar contraseñas en el historial del usuario
const isPasswordInHistory = async (email, password) => {
    try {
        // Buscar al usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar si la contraseña proporcionada coincide con alguna en old_passwords
        for (const oldPassword of user.old_passwords) {
            const isMatch = await bcrypt.compare(password, oldPassword);
            if (isMatch) {
                return true; // La contraseña ya existe en el historial
            }
        }

        return false; // La contraseña no está en el historial
    } catch (error) {
        console.error(error.message);
        throw new Error('Error al verificar la contraseña en el historial');
    }
};

// Helper para subir archivos a Cloudinary desde el buffer
const uploadFileFromBuffer = (file, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(file.buffer);
  });
};

// Subir documentos del aspirante
const uploadUserDocs = async (req, res) => {
    try {
      const userId = req.params.id;
      const files = req.files?.docs;
  
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron archivos.' });
      }
      
      // Array para almacenar los documentos después de subirlos a Cloudinary
      const docsArray = [];
      
      // Subir cada archivo a Cloudinary
      for (const file of files) {
        const result = await uploadFileFromBuffer(file, {
          folder: `aspirantes/${userId}/docs`,
          resource_type: 'auto'
        });
        
        docsArray.push({
          name: file.originalname,
          url: result.secure_url,
          type: file.mimetype,
          uploadDate: new Date()
        });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { docsAspirante: { $each: docsArray } } },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error('Error en uploadUserDocs:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  };

// Actualizar estado de aprobación de documentos
const updateDocsStatus = async (req, res) => {
    const { id } = req.params;
    const { docsStatus } = req.body;
    
    try {
        // Verificar que el usuario exista
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar el estado de los documentos
        user.docsStatus = docsStatus;
        await user.save();

        res.status(200).json({ 
            message: 'Estado de documentos actualizado correctamente',
            docsStatus: user.docsStatus
        });
    } catch (error) {
        console.error('Error al actualizar estado de documentos:', error);
        res.status(500).json({ message: 'Error al actualizar estado de documentos' });
    }
};

export {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    login,
    updateUserByEmail,
    isPasswordInHistory,
    uploadUserDocs,
    updateDocsStatus
}
