import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }catch(error){
      this.handleExeptions(error,"Can not create pokemon -check server logs");
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }
    
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }
    
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    if(!pokemon) throw new NotFoundException("Pokemon is not found");
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon =  await this.findOne(term);
      if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      await pokemon.updateOne(updatePokemonDto) 
      return { ...pokemon.toJSON(),...updatePokemonDto }
    } catch (error) {
      this.handleExeptions(error,"Can not update pokemon -check server logs");
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return { id }
    const { deletedCount } = await this.pokemonModel.deleteOne({_id:id });
    if(deletedCount == 0) throw new BadRequestException(`Pokemon with id ${id} not found`);

    return;
  }

  private handleExeptions(error:any, internalServerMessage:string = 'Please check server logs'){
    if(error.code == 11000) throw new BadRequestException("Pokemon alredy exist");
      console.log(error);
      throw new InternalServerErrorException(internalServerMessage);
  }
}
