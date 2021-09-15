const Voting = artifacts.require('./Voting.sol');

contract('Voting', (accounts) => {
  let votingInstance;

  beforeEach('Deploys contract', async () => {
    votingInstance = await Voting.new('Title', 'Description');
  });

  it('Stores owner, title and description', async () => {
    const owner = await votingInstance.owner.call();
    const storedTitle = await votingInstance.title.call();
    const storedDescription = await votingInstance.description.call();

    assert.equal(owner, accounts[0], 'Owner was not first account');
    assert.equal(storedTitle, 'Title', 'Title was not stored');
    assert.equal(storedDescription, 'Description', 'Description was not stored');
  });

  it('Can vote', async () => {
    const prevCount = await votingInstance.countA.call();
    // True means vote for A
    await votingInstance.vote(true).send({ from: accounts[1] });
    const hasVoted = await votingInstance.voters(accounts[1]).call();
    const afterCount = await votingInstance.countA.call();

    assert.equal(hasVoted, true, "Vote wasn't casted");
    assert.equal(prevCount + 1, afterCount, "Vote count wasn't raised");
  });

  it('Owner can announce result', async () => {
    await votingInstance.announceResult().send({ from: accounts[0] });
    const isResultAnnounced = await votingInstance.isResultAnnounced.call();

    assert.equal(isResultAnnounced, true, 'Result announcement failed');
  });

  it('Only owner can announce result', async () => {});
  it("Same address can't vote twice", async () => {});
  it("Can't vote after results announced", async () => {});
});
