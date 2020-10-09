const AddressListFactory = artifacts.require("AddressListFactory");
const AddressList = artifacts.require("AddressList");

const {expectRevert, expectEvent, BN, constants} = require('@openzeppelin/test-helpers');

const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const LIST_ADMIN = web3.utils.soliditySha3('LIST_ADMIN');

contract("AddressListFactory", async accounts => {
  let factory;

  beforeEach(async () => {
    factory = await AddressListFactory.new();
  });

  it("initial listCount is 0", async () => {
    let answer = await factory.listCount();
    assert.equal(answer, 0);
  });

  it("createList should increase listCount", async () => {
    await factory.createList();
    assert.equal(await factory.listCount(), 1);
    await factory.createList();
    assert.equal(await factory.listCount(), 2);
  });

  it("createList should emit ListCreated", async () => {
    let answer = await factory.createList.call();
    let tx = await factory.createList();
    await expectEvent(tx, 'ListCreated', {_sender: accounts[0], _newList: answer});
  });

  it("should add lists sequentially", async () => {
    let a0 = await factory.createList.call();
    await factory.createList();
    let a1 = await factory.createList.call();
    await factory.createList();
    let count = await factory.listCount();
    assert.equal(count, 2);
    let b0 = await factory.listAt(0);
    let b1 = await factory.listAt(1);
    assert.equal(a0, b0);
    assert.equal(a1, b1);
  });

  it("index out-of-bounds should revert", async () => {
    await expectRevert.unspecified(factory.listAt(0));
    await expectRevert.unspecified(factory.listAt(1));
    await factory.createList();
    await expectRevert.unspecified(factory.listAt(1));
  });

  it("ours(address) answers false with random addresses", async () => {
    assert.equal(await factory.ours(constants.ZERO_ADDRESS), false);
    assert.equal(await factory.ours(accounts[1]), false);
  });

  it("ours(address) answers true with the address of a created list", async () => {
    let listAddress = await factory.createList.call();
    await factory.createList();
    assert.equal(await factory.ours(listAddress), true);
  });

  it("new list should be owned by sender", async () => {
    let newListAddress = await factory.createList.call();
    await factory.createList();
    let newList = await AddressList.at(newListAddress);
    assert.equal(await newList.hasRole(LIST_ADMIN, accounts[0]), true);
  });
});