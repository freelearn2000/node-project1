import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column({unique:true})
    email?: string;

    @Column()
    password?: string;

    @Column()
    address?: string;
}

export class UserValidator {

    @IsString( {message: `Name should be a string`} )
    @IsNotEmpty( {message: `Name should be defined`} )
    name?: string;

    @IsEmail( {}, {message: `Email is not valid`} )
    @IsNotEmpty( {message: `Email should be defined`} )
    email?: string;

    @IsNotEmpty( {message: `Password should be defined`} )
    password?: string;

    @IsNotEmpty( {message: `Address should be defined`} )
    address?: string;
}

export class AuthUserValidator {

    @IsEmail( {}, {message: `Email is not valid`} )
    @IsNotEmpty( {message: `Email should be defined`} )
    email?: string;

    @IsNotEmpty( {message: `Password should be defined`} )
    password?: string;
}
