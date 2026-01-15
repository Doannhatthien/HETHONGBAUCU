const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ClassElectionModule", (m) => {
  const classElection = m.contract("ClassElection");
  return { classElection };
});
