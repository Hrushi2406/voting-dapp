const Voting = artifacts.require("./Voting.sol");
var chai = require("chai");
should = chai.should();

contract("Voting", (accounts) => {
  let votingInstance;

  beforeEach("Deploys contract", async () => {
    // Deploy new contract before each test
    votingInstance = await Voting.new("Title", "Description", {
      from: accounts[0],
    });
  });

  it("Stores owner, title and description", async () => {
    const owner = await votingInstance.owner.call();
    const storedTitle = await votingInstance.title.call();
    const storedDescription = await votingInstance.description.call();

    // Check if initial data stored
    owner.should.equal(accounts[0], `Owner is not stored`);
    storedTitle.should.equal("Title", "Title does not match");
    storedDescription.should.equal("Description", "Description does not match");
  });

  it("Can vote", async () => {
    // const prevCount = await votingInstance.count;
    const prevCount = await votingInstance.countA.call();

    // True means vote for A
    await votingInstance.vote(true, { from: accounts[1] });
    const afterCount = await votingInstance.countA.call();

    // Check if vote count is increased
    (prevCount.toNumber() + 1).should.equal(
      afterCount.toNumber(),
      "Count is not raised"
    );
  });

  it("Owner can announce result", async () => {
    const transaction = await votingInstance.announceResult({
      from: accounts[0],
    });

    // Access logs from transaction
    const { logs } = transaction;
    assert.ok(Array.isArray(logs), "logs is not an array");
    logs.length.should.equal(1, "Multiple events are emitted");

    // Access events from logs
    const log = logs[0];
    log.event.should.equal("ResultAnnounced", "Incorrect event was emitted");
    log.args.countA.toNumber().should.equal(0, "Count A does not match");
    log.args.countB.toNumber().should.equal(0, "Count B does not match");

    // Check if flag set
    const isResultAnnounced = await votingInstance.isResultAnnounced.call();
    isResultAnnounced.should.equal(true, "Result flag not set");
  });

  it("Only owner should announce result", async () => {
    try {
      // Try announcing results from non-owner account
      await votingInstance.announceResult({ from: accounts[1] });
    } catch (err) {
      err.toString().should.include("Only owner can announce result");
    }
  });

  it("Same address can't vote twice", async () => {
    await votingInstance.vote(true, { from: accounts[1] });
    try {
      // Vote again
      await votingInstance.vote(true, { from: accounts[1] });
    } catch (err) {
      err.toString().should.include("You have already voted");
    }
  });

  it("Can't vote after results announced", async () => {
    await votingInstance.announceResult({ from: accounts[0] });
    try {
      // Vote after results are announced
      await votingInstance.vote(true, { from: accounts[1] });
    } catch (err) {
      err.toString().should.include("Cannot vote after result announcement");
    }
  });
});
