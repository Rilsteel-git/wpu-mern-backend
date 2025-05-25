import { Request, response, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";


type TRegister = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
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
};