import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { IsNotEmpty, IsNumber, IsString,Matches } from 'class-validator';


@Entity()
export class location {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    pin?: number;
} 

export class LocationValidator {

    @Matches( (/^[a-zA-Z\-]+$/), {message: 'Name should be a String'} )
    @IsString( {message: 'Name should be a string'} )
    @IsNotEmpty( {message: 'Name should be defined'} )
    name?: string;

    @IsNumber( {}, {message: 'Pin should be a number'} )
    @IsNotEmpty( {message: 'Pin should be defined'} )
    pin?: number;
}