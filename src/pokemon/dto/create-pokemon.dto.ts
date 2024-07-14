import { IsInt, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsString()
    @MinLength(3) 
    name: string;

    
    @IsNumber()
    @IsInt()
    @IsPositive()
    no : number;
}
