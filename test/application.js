const Application = artifacts.require("./Application.sol");

contract("Application", (accounts) => {
    let applicationInstance;

    beforeEach("Access deployed contract", async () => {
        // Access deployed contract
        applicationInstance = await Application.deployed();
    });

    it("Creates an election", async () => {
        try {
            // Create election from accounts[1]
            const transaction = await applicationInstance.createElection("Voting 201", "This is voting 201", ["A", "B", "C"], { from: accounts[1] });

            // Access logs from transaction
            const { logs } = transaction;
            assert.ok(Array.isArray(logs), "logs is not an array");
            assert.equal(logs.length, 1, "Multiple events are emitted");

            // Access events from logs
            const log = logs[0];
            assert.equal(log.event, "ElectionCreated", "Incorrect event was emitted");
            assert.notEqual(log.args.electionAddress, null, "Contract address wasn't emitted");
            assert.equal(log.args.ownerAddress, accounts[1], "Owner address doesn't match");

        } catch (err) {
            assert.isTrue(false, err.toString())
        }
    });

    it("Can't create election with empty title or description", async () => {
        try {
            // Create election with empty title or description
            await applicationInstance.createElection("", "", ["A", "B", "C"], { from: accounts[1] });
            assert.isTrue(false, "Election contract gets deployed successfully")
        } catch (err) {
            assert.include(err.toString(), "Title or Description can't be empty")
        }
    });

    it("Can't create election with empty options", async () => {
        try {
            // Create election with empty title or description
            await applicationInstance.createElection("Voting 301", "This is voting 301", ["", "B", ""], { from: accounts[1] });
            assert.isTrue(false, "Election contract gets deployed successfully")
        } catch (err) {
            assert.include(err.toString(), "Options can't be empty")
        }
    });
});
