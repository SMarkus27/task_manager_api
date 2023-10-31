import {errorHandler, ErrorResponse} from "../../domain/responses/error/response";
import {UsersRepository} from "../../repositories/users/repository";
import {IUsersService} from "../../core/interfaces/services/users/interface";
const jwt = require("jsonwebtoken");
import { config } from "dotenv";
import {invalidCredentialsError, noCredentialsError, authorizationError} from "../../domain/errors/error";
import {createUserResponse} from "../../domain/responses/users/response";
config()

export class UsersService implements IUsersService{
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async createUser(userData: object, response) {
        try {
            const token= await this.usersRepository.createUser(userData);
            return createUserResponse(response, token)
        }
        catch (error) {
           return errorHandler(error, response)
        }

    };


    async login(userData: object, response, next) {
        const {email, password} = userData
        if (!email || !password) {
            return errorHandler(noCredentialsError, response)
        }

        const user = await this.usersRepository.findUser({email}, {},{select: "+password", sanitizeFilter: true})
        const isMatch = await this.usersRepository.matchPassword(userData);

        if(!user || !isMatch) {
            return errorHandler(invalidCredentialsError, response)
        }

        const token= await this.usersRepository.getToken(email);
        response.status(200).json({success: true, token});

    }

    async authentication(request, response, next) {
        let token;
        const headers = request.headers
        const authorizationToken = headers.authorization

        if (authorizationToken && authorizationToken.startsWith("Bearer")) {
            token = request.headers.authorization.split(" ")[1];
        }

        if(!token) {
            return  errorHandler(authorizationError, response)
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const xaps = new UsersRepository();
            request.user =  await xaps.findUser({_id: decodedToken.id}, {_id: true}, {});
            next()
        }
        catch (err){
            return  errorHandler(err, response)
        }
    }

}