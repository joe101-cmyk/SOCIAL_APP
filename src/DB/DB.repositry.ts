import { Model, PopulateOptions, ProjectionType, CreateOptions, HydratedDocument } from "mongoose";
import { QueryFilter } from "mongoose";
import { QueryOptions } from "mongoose";
export abstract class DBRepository<TDocument> {
    constructor(protected readonly model: Model<TDocument>) {}

    async findOne({
        filter,
        select,
        option,
    }: {
        filter?: QueryFilter<TDocument>;
        select?: ProjectionType<TDocument> | null;
        option?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null> {
        let query = this.model.findOne(filter || {});

        if (select) {
            query = query.select(select);
        }

        if (option?.populate) {
            query = query.populate(option.populate as PopulateOptions | PopulateOptions[]);
        }

        return query.exec();
    }

    async findById({
        id,
        select,
        option,
    }: {
        id: string;
        select?: ProjectionType<TDocument> | null;
        option?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null> {
        let query = this.model.findById(id);

        if (select) {
            query = query.select(select);
        }

        if (option?.populate) {
            query = query.populate(option.populate as PopulateOptions | PopulateOptions[]);
        }

        return query.exec();
    }

    async create({
        data,
        options,
    }: {
        data: Partial<TDocument>;
        options?: CreateOptions | null;
    }): Promise<HydratedDocument<TDocument>> {
        const doc = await this.model.create(data as any, options || undefined);
        return doc as HydratedDocument<TDocument>;
    }

    async updateOne({
        filter,
        update,
        options,
    }: {
        filter: QueryFilter<TDocument>;
        update: Partial<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null> {
        let query = this.model.findOneAndUpdate(filter, update, { new: true, ...options });

        if (options?.populate) {
            query = query.populate(options.populate as PopulateOptions | PopulateOptions[]);
        }

        return query.exec();
    }
    
}