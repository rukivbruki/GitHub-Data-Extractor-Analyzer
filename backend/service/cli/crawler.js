const chalkPipe = require("chalk-pipe");
const fs = require("fs");
const Table = require("cli-table");
const { _ } = require("lodash");
const moment = require("moment");

const {
  dateCreator,
  isEmpty,
  // stopService,
  // doHardWork
} = require("../../helpers");
const api = require(`../../api`).getAPI();
const { singleBar } = require(`../../service/lib/cliProgress`);
const { getMenu } = require("./menu");
const { getLogger } = require(`../../service/lib/logger`);
// const { saveSearch, getAllSearches } = require('../database');

const warning = chalkPipe("orange.bold");
const info = chalkPipe("yellow.bold");

let crawlerData = {};

async function* fetchCommits(place, id) {
  let dateObj = {
    [id]: _.cloneDeep(dateCreator),
  };
  let nextPage = null;
  console.log("ПОПАЛИ В ГЕНЕРАТОР", dateObj[id], dateCreator);
  let after = null;
  while (dateObj[id].checkDate()) {
    const date1 = dateObj[id].date1.format("YYYY-MM");
    const date2 = dateObj[id].date2.format("YYYY-MM");
    console.log(date1, date2, dateCreator.checkDate(), nextPage);
    const queryString1 = `location:${place} created:${date1}..${date2}`;
    console.log("СМОТРИМ queryString1, after", queryString1, after);
    const query = {
      query: `
  query ($queryString1: String!, $after: String) {
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
  result: search(query: $queryString1, type: USER, first: 100, after: $after) {
    userCount
    pageInfo{
      endCursor
      hasNextPage
    }
    edges {
      node {
        ... on User {
          location
          login
          repositories(first: 100) {
            edges {
              node {
                url
                primaryLanguage {
                    name
                }
              }
            }
          }
        }
      }
    }
  }
}
  `,

      variables: { queryString1, after },
    };

    const res = await api.postQuery("graphql", query);
    const body = await res.data;
    console.log(after);
    console.log(nextPage);
    after = await body.data.result.pageInfo.endCursor;
    nextPage = body.data.result.pageInfo.hasNextPage;
    nextPage === false ? dateObj[id].getDate() : null;
    for (let item of body.data.result.edges) {
      yield item;
    }
  }
}

const executor = async (answers, ans, logger, webFlag) => {
  console.log("СМОТРИМ answers.id", ans);
  const DELAY = 4000;
  const startTime = moment().unix();
  console.log(startTime);
  let count = 0;
  console.log(Number(answers.count));

  crawlerData[answers] = {
    progress: 0,
    totalRepos: null,
    userSearchEnd: "",
    names: [],
    errors: [],
  };

  crawlerData[answers].userSearchStart = moment();

  //Проверяем, что у пользователя есть репозитории, и если есть, добавляем его
  // логин для последующего обхода.

  for await (const item of fetchCommits(ans.city)) {
    console.log(item.node?.repositories);
    Boolean(item.node.repositories?.edges?.length) &&
      crawlerData[answers].names.push(item.node.login);

    if (++count === Number(ans.count)) {
      break;
    }
  }
  /**/

  logger.debug(`USER SEARCH END`);

  crawlerData[answers].userSearchEnd = moment();

  fs.writeFile("users.txt", `${crawlerData[answers].names}`, function (error) {
    if (error) throw error; // если возникла ошибка
    console.log("Асинхронная запись файла завершена. Содержимое файла:");
    console.log("\n" + `Users: `, crawlerData[answers].names);
    console.log(
      info("\n" + "Total: ", crawlerData[answers].names.length + "\n")
    );
  });

  const getInfo = async (item) => {
    const printResult = () =>
      crawlerData[answers].names.length === crawlerData[answers].progress
        ? (() => {
            const table = new Table();
            singleBar.stop();
            table.push(
              {
                "User search end": `${crawlerData[answers].userSearchStart}`,
              },
              {
                "User search end": `${crawlerData[answers].userSearchEnd}`,
              },
              {
                "Total projects": `${crawlerData[answers].totalRepos}`,
              },
              {
                "Total number users": `${crawlerData[answers].names.length}`,
              },
              {
                "Total number errors": `${crawlerData[answers].errors.length}`,
              },
              { "Applied delay": `${DELAY}` },
              { "Spent time": `${moment().unix() - startTime}` / 60 }
            );
            console.log(table.toString());
            // saveSearch(answers, crawlerData)
            !webFlag ? setTimeout(() => process.exit(0), 1000) : null;
          })()
        : null;
    await api
      .searchCode(item, answers)
      .then((res) => {
        logger.debug({
          "User number": crawlerData[answers].names.indexOf(item),
          "Remaining limit": res.headers["x-ratelimit-remaining"],
          Login: item,
        });
        crawlerData[answers].totalRepos += res.data.total_count;
        crawlerData[answers].progress++;
        crawlerData[answers].totalTime = `${moment().unix() - startTime}` / 60;
        console.log(
          info(
            singleBar.start(
              crawlerData[answers].names.length,
              crawlerData[answers].progress
            )
          )
        );
        printResult();
      })
      .catch((err) => {
        crawlerData[answers].progress++;
        printResult();
        crawlerData[answers].errors.push(err);
        logger.error(
          err,
          `Number of errors: ${crawlerData[answers].errors.length}`
        );
      });
  };
  for (const item of crawlerData[answers].names) {
    setTimeout(
      () =>
        getInfo(item).then(() => {
          console.log(
            warning(
              `Find projects with ${ans.lib}: ${crawlerData[answers].totalRepos}`
            )
          );
        }),
      DELAY * crawlerData[answers].names.indexOf(item)
    );
  }
};
module.exports = {
  name: `--crawler`,
  crawlerData: crawlerData,
  async run(args, platform, clientFormData) {
    const webFlag = platform === "web";
    if (!webFlag) {
      const consoleLogger = getLogger({
        name: "logger-GitHub",
        level: args[0],
      });
      getMenu().then((answers) => {
        console.log(answers);
        return executor("console", answers, consoleLogger);
      });
    }
    if (webFlag) {
      clientFormData = JSON.parse(clientFormData);
      const webLogger = getLogger({ name: "logger-api", level: args[0] });
      await executor(clientFormData.id, clientFormData, webLogger, webFlag);
    }
  },
};
