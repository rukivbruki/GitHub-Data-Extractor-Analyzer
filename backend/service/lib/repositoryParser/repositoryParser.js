class RepositoryParser {
  constructor() {
    this.filters = new Map();
  }

  addFilter(filterName, filterFunction) {
    if (this.filters.has(filterName)) {
      throw new Error('[Repository Parser] filter with this name already exists!');
    }
    this.filters.set(filterName, filterFunction);
    return this;
  }

  async execute() {
    const result = new Map();
    await Promise.all(
      [...this.filters.keys()].map(async (filterName) => {
        const filter = this.filters.get(filterName);
        result.set(filterName, await filter());
      })
    );
    return result;
  }
}

module.exports = RepositoryParser;