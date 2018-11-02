#! /usr/bin/env node
const fetch = require("node-fetch");

const notify = (status, shouldNotify = true) =>
  console.log(status, shouldNotify ? "\u0007" : "");

const [username, reponame] = process.argv[2].toLowerCase().split("/");
const branchName = process.argv[3] || "master";
const encodedBranchName = encodeURIComponent(branchName);

const userToken = process.env.CIRCLECI_API_TOKEN;

if (!userToken) {
  console.log("CIRCLECI_API_TOKEN not set");
  process.exit(1);
}

const url = "https://circleci.com/api/v1/projects?shallow=true";
let shouldNotify = false;

const fetchStatus = () => {
  return fetch(url, {
    headers: {
      Authorization: "Basic " + Buffer.from(userToken + ":").toString("base64")
    }
  })
    .then(r => r.json())
    .then(projects => {
      const targetProject = projects.find(
        p =>
          p.username.toLowerCase() === username &&
          p.reponame.toLowerCase() === reponame
      );

      if (!targetProject) {
        throw new Error(`No project found for ${username}/${reponame}`);
      }

      const targetBranch = targetProject.branches[encodedBranchName];

      if (!targetBranch) {
        throw new Error(
          `No branch found in ${username}/${reponame} for ${branchName}`
        );
      }

      const firstWorkflow = Object.keys(targetBranch.latest_workflows).filter(
        k => k !== "config-errors"
      )[0];

      const { status, id: workflowId } = targetBranch.latest_workflows[
        firstWorkflow
      ];

      const msg = branchName + ": " + status;

      if (status == "running") {
        shouldNotify = true;
        notify(msg, false);
        setTimeout(fetchStatus, 5 * 1000);
      } else {
        notify(msg, shouldNotify);
        if (status !== "success") {
          console.log(
            `For details see: https://circleci.com/workflow-run/${workflowId}`
          );
          process.exit(1);
        }
      }
    });
};

fetchStatus().catch(e => console.log(e.message));
