const { expect } = require("chai");

describe("Voting contract", function () {
  async function deployVotingFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(["Candidate A", "Candidate B", "Candidate C"]);

    await voting.waitForDeployment();

    return { voting, owner, voter1, voter2 };
  }

  it("Should deploy with three candidates and zero votes", async function () {
    const { voting } = await deployVotingFixture();

    expect(await voting.candidatesCount()).to.equal(3);
    expect(await voting.getVotes(1)).to.equal(0);
    expect(await voting.getVotes(2)).to.equal(0);
    expect(await voting.getVotes(3)).to.equal(0);
  });

  it("Should allow a valid vote and update the vote count", async function () {
    const { voting, voter1 } = await deployVotingFixture();

    await voting.connect(voter1).vote(2, "voter1@test.com");

    expect(await voting.getVotes(2)).to.equal(1);
    expect(await voting.hasvoted(voter1.address, "voter1@test.com")).to.equal(true);
  });

  it("Should reject duplicate votes from the same wallet or email", async function () {
    const { voting, voter1 } = await deployVotingFixture();

    await voting.connect(voter1).vote(1, "alice@test.com");

    await expect(voting.connect(voter1).vote(2, "bob@test.com")).to.be.revertedWith(
      "You have already voted."
    );

    await expect(voting.connect(voter1).vote(3, "alice@test.com")).to.be.revertedWith(
      "You have already voted."
    );
  });

  it("Should reject invalid candidate IDs", async function () {
    const { voting, voter1 } = await deployVotingFixture();

    await expect(voting.connect(voter1).vote(0, "alice@test.com")).to.be.revertedWith(
      "Invalid candidate ID."
    );

    await expect(voting.connect(voter1).vote(99, "alice@test.com")).to.be.revertedWith(
      "Invalid candidate ID."
    );
  });

  it("Should return the winning candidate ID", async function () {
    const { voting, voter1, voter2 } = await deployVotingFixture();

    await voting.connect(voter1).vote(1, "v1@test.com");
    await voting.connect(voter2).vote(1, "v2@test.com");

    expect(await voting.getWinner()).to.equal(1);
  });
});
