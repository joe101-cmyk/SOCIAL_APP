    import { Model } from "mongoose";

import { Iuser } from "../models/user.model.js";
import { DBRepository } from "../DB.repositry.js";

export class UserRepository extends DBRepository<Iuser> {
    constructor(model: Model<Iuser>) {
        super(model);
    }}