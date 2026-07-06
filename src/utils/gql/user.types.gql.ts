import { 
  GraphQLEnumType, 
  GraphQLID, 
  GraphQLObjectType, 
  GraphQLString 
} from 'graphql';

import { GenderEnum, RoleEnum, Web_enum } from '../enum/auth.enum.js';

export const GenderEnums = new GraphQLEnumType({
  name: 'GenderEnum',
  values: {
    MALE: { value: GenderEnum.MALE },
    FEMALE: { value: GenderEnum.FEMALE },
  }
});

export const WebEnums = new GraphQLEnumType({
  name: 'WebEnum',
  values: {
    GOOGLE: { value: Web_enum.google },
    FACEBOOK: { value: Web_enum.facebook },
    APPLE: { value: Web_enum.apple },
  }
});

export const OneUserGql = new GraphQLObjectType({
  name: 'OneUserGql',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GenderEnums },  
    web: { type: WebEnums }     
    } )
});


export const ProfleResponseGql = new GraphQLObjectType({
  name: 'ProfleResponseGql',
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    data: { type: OneUserGql }
  })
});

