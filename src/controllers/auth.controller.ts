import { Request, response, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";


type TRegister = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type TLogin = {
    identifier: string;
    password: string;
}

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    userName: Yup.string().required('Username is required'),
    email: Yup.string()
        .email('Format email is invalid')
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords not match'),
})

const loginValidateSchema = Yup.object({
    identifier: Yup.string().required('username or email is required'),
    password: Yup.string().required('Password is required'),
});

export default {
    async register(req: Request, res: Response) {
        const { fullName, userName, email, password, confirmPassword } = req.body as unknown as TRegister;

        try {
            await registerValidateSchema.validate({ fullName, userName, email, password, confirmPassword });

            // Check if email already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email already exists!',
                    data: null
                });
            }

            const result = await UserModel.create({ fullName, userName, email, password });

            res.status(200).json({
                message: 'Success registration!',
                data: result,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            });
        }
    },

    async login(req: Request, res: Response) {
        const { 
            identifier,
            password
        } = req.body as unknown as TLogin;

        try {
            // Validate input
            await loginValidateSchema.validate({ identifier, password }, { abortEarly: false });

            // get user by identifier (email or username)
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    { email: identifier },
                    { userName: identifier }
                ]
            });

            if (!userByIdentifier) {
                return res.status(404).json({
                    message: 'User not found!',
                    data: null
                });
            }

            // validate user
            const isValidatePassword: boolean = encrypt(password) === userByIdentifier.password;
            if (!isValidatePassword) {
                return res.status(400).json({
                    message: 'Invalid password!',
                    data: null
                });
            }

            // Success login
            res.status(200).json({
                message: "Login successful!",
                data: userByIdentifier
            })

        }catch (error) {
            // Cek apakah error adalah instance dari Yup.ValidationError
            if (error instanceof Yup.ValidationError) {
            // Jika error pada identifier, kirim hanya error identifier
            const identifierError = error.inner.find(e => e.path === 'identifier');
                if (identifierError) {
                    return res.status(400).json({
                        message: identifierError.message,
                        data: null
                    });
                }
                // Jika tidak ada error identifier, kirim error pertama
                return res.status(400).json({
                    message: error.errors[0],
                    data: null
                });
            }
            // Error lain
            return res.status(400).json({
                message: 'Validation error',
                data: null
            });
        }
    }
};