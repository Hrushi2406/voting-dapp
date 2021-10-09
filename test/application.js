const Application = artifacts.require("./Application.sol");
const Election = artifacts.require("./Election.sol");

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

    it("Stores election data ", async () => {
        // Get address of election contract deployed in last test
        const electionAddress = await applicationInstance.elections.call(0);

        // Access Election contract instance at electionAddress
        const electionInstance = await Election.at(electionAddress);

        // Fetch stored data
        const owner = await electionInstance.owner.call();
        const storedTitle = await electionInstance.title.call();
        const storedDescription = await electionInstance.description.call();
        const nOptions = await electionInstance.nOptions.call();
        const storedOption = await electionInstance.optionCounts.call(0);

        // Check if stored data matches passed data
        assert.equal(owner, accounts[1], "Owner does not match");
        assert.equal(storedTitle, "Voting 201", "Title does not match");
        assert.equal(
            storedDescription,
            "This is voting 201",
            "Description does not match"
        );
        assert.equal(nOptions, 3, "No of options does not tally");
        assert.equal(storedOption.name, "A", "First option does not match");
    });
});
