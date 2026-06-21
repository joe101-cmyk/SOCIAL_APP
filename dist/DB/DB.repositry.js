export class DBRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, select, option, }) {
        let query = this.model.findOne(filter || {});
        if (select) {
            query = query.select(select);
        }
        if (option?.populate) {
            query = query.populate(option.populate);
        }
        return query.exec();
    }
    async findById({ id, select, option, }) {
        let query = this.model.findById(id);
        if (select) {
            query = query.select(select);
        }
        if (option?.populate) {
            query = query.populate(option.populate);
        }
        return query.exec();
    }
    async create({ data, options, }) {
        const doc = await this.model.create(data, options || undefined);
        return doc;
    }
    async updateOne({ filter, update, options, }) {
        let query = this.model.findOneAndUpdate(filter, update, { new: true, ...options });
        if (options?.populate) {
            query = query.populate(options.populate);
        }
        return query.exec();
    }
}
