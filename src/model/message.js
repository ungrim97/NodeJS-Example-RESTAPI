module.exports = class Message {
  constructor(args) {
    this.id = args.id;
    this.text = args.text;
    this.owner = args.owner;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.createdBy = args.createdBy;
    this.updatedBy = args.updatedBy;
  }

  static getTotal(deps, args) {
    if (!deps.daoFac) {
      throw new Error('deps.dao is a required arg to getTotal');
    }

    if (deps.timings) {
      deps.timings.startSpan('message:totalMessage');
    }

    return deps.daoFac
      .daoFor('message')
      .then(dao => {
        return dao.totalMessages({ timings: deps.timings });
      })
      .then(totalCount => {
        if (deps.timings) {
          deps.timings.stopSpan('message:totalMessage');
        }

        return totalCount;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:totalMessage');
        }

        throw error;
      });
  }

  static getAll(deps, args) {
    if (!deps.daoFac) {
      throw new Error('deps.dao is a required arg to getTotal');
    }

    if (deps.timings) {
      deps.timings.startSpan('message:getAll');
    }

    const query = {};
    if (args.limit) {
      query.limit = args.limit;
      query.offset = args.offset || 0;
    }

    return deps.daoFac
      .daoFor('message')
      .then(dao => dao.getAll({ timings: deps.timings }, query))
      .filter(message => message)
      .map(message => new Message(message))
      .then(messages => {
        if (deps.timings) {
          deps.timings.stopSpan('message:getAll');
        }

        return messages;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:getAll');
        }

        throw error;
      });
  }
};
