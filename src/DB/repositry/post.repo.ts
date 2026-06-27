    import { Model } from "mongoose";
import { Ipost } from "../models/postmodel.js";
import { DBRepository } from "../DB.repositry.js";

export class PostRepository extends DBRepository<Ipost> {
    constructor(model: Model<Ipost>) {
        super(model);
    }}