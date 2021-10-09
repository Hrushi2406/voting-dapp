// const Election = artifacts.require("./Election.sol");

// contract("Election", (accounts) => {
//   let electionInstance;

//   beforeEach("Access deployed contract", async () => {
//     // Access deployed contract
//     electionInstance = await Election.deployed();
//   });

//   it("Stores owner, title and description", async () => {
//     const owner = await electionInstance.owner.call();
//     const storedTitle = await electionInstance.title.call();
//     const storedDescription = await electionInstance.description.call();
//     const nOptions = await electionInstance.nOptions.call();
//     const storedOption = await electionInstance.optionCounts.call(0);

//     // Check if stored data matches passed data
//     assert.equal(owner, accounts[0], "Owner does not match");
//     assert.equal(storedTitle, "Voting 101", "Title does not match");
//     assert.equal(
//       storedDescription,
//       "This is voting 101",
//       "Description does not match"
//     );
//     assert.equal(nOptions, 3, "No of options does not tally");
//     assert.equal(storedOption.name, "sumit", "First option does not match");
//   });

//   it("Can vote", async () => {
//     const prevState = await electionInstance.optionCounts.call(0);

//     // Vote for index 0 from account 1
//     await electionInstance.vote(0, { from: accounts[1] });
//     const afterState = await electionInstance.optionCounts.call(0);

//     // Check if vote count is increased
//     assert.equal(
//       prevState.count.toNumber() + 1,
//       afterState.count.toNumber(),
//       "Count is not raised"
//     );
//   });

//   it("Same address can't vote twice", async () => {
//     try {
//       // Vote again from account 1
//       await electionInstance.vote(1, { from: accounts[1] });
//     } catch (err) {
//       assert.include(err.toString(), "You have already voted");
//     }
//   });

//   it("Only owner can announce result", async () => {
//     try {
//       // Try announcing results from non-owner account
//       await electionInstance.announceResult({ from: accounts[1] });
//     } catch (err) {
//       assert.include(err.toString(), "Only owner can announce result");
//     }
//   });

//   it("Owner can announce result", async () => {
//     // Announce result from owner's account
//     const transaction = await electionInstance.announceResult({
//       from: accounts[0],
//     });

//     // Access logs from transaction
//     const { logs } = transaction;
//     assert.ok(Array.isArray(logs), "logs is not an array");
//     assert.equal(logs.length, 1, "Multiple events are emitted");

//     // Access events from logs
//     const log = logs[0];
//     assert.equal(log.event, "ResultAnnounced", "Incorrect event was emitted");
//     assert.equal(log.args.winnerOption.name, "sumit", "Winner does not match");
//     assert.equal(
//       log.args.winnerOption.count,
//       1,
//       "Winner vote count does not match"
//     );
//     assert.equal(log.args.maxVotes, 1, "Max vote count does not match");

//     // Check if flag set
//     const isResultAnnounced = await electionInstance.isResultAnnounced.call();
//     assert.equal(isResultAnnounced, true, "Result flag not set");
//   });

//   it("Can't vote after results announced", async () => {
//     try {
//       // Vote after results are announced
//       await electionInstance.vote(0, { from: accounts[3] });
//     } catch (err) {
//       assert.include(err.toString(), "Cannot vote after result announcement");
//     }
//   });
// });
