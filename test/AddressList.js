const AddressList = artifacts.require("AddressList");

const {expectRevert, expectEvent, BN, constants} = require('@openzeppelin/test-helpers');

contract("AddressList", async accounts => {
  let list;

  beforeEach(async () => {
    list = await AddressList.new(accounts[0]);
  });

  it("initial length is 0", async () => {
    let length = await list.length();
    assert.equal(length, 0);
  });

  it("get absent should return zero", async () => {
    let answer = await list.get(accounts[1]);
    assert.equal(answer, 0);
  });

  it("empty list at should revert", async () => {
      await expectRevert.unspecified(list.at(0));
      await expectRevert.unspecified(list.at(1));
      await expectRevert.unspecified(list.at(100));
  });

  describe("add", async () => {
    it("add new should increase length", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      let length = await list.length();
      assert.equal(length, 3);
    });

    it("add duplicate should not increase length", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      await list.add(accounts[1]);
      let length = await list.length();
      assert.equal(length, 3);
    });

    it("after add, at should return 1", async () => {
      await list.add(accounts[1]);
      let answer = await list.at(0);
      assert.equal(answer[1], 1);
    });

    it("after add, get should return 1", async () => {
      await list.add(accounts[1]);
      let value = await list.get(accounts[1]);
      assert.equal(value, 1);
    });

    it("after add, get should still return zero on absent", async () => {
      await list.add(accounts[1]);
      let answer = await list.get(accounts[4]);
      assert.equal(answer, 0);
    });

    it("add new should emit AddressUpdated", async () => {
      await expectEvent(await list.add(accounts[1]), 'AddressUpdated', {a: accounts[1], sender: accounts[0]});
    });

    it("add new should return true", async () => {
      let answer = await list.add.call(accounts[1]);
      assert.equal(answer, true);
    });

    it("add duplicate should not emit AddressUpdated", async () => {
      await list.add(accounts[1]);
      expectEvent.notEmitted(await list.add(accounts[1]), 'AddressUpdated');
    });

    it("add duplicate should return false", async () => {
      list.add(accounts[1]);
      let answer = await list.add.call(accounts[1]);
      assert.equal(answer, false);
    });

    it("add by non-admin should revert", async () => {
      await expectRevert.unspecified(list.add(accounts[4], {from: accounts[1]}));
    });
  });

  describe("addValue", async () => {
    it("after addValue, get should return the value", async () => {
      await list.addValue(accounts[1], 42);
      let value = await list.get(accounts[1]);
      assert.equal(value, 42);
    });

    it("after addValue, at should return the value", async () => {
      await list.addValue(accounts[1], 42);
      let answer = await list.at(0);
      assert.equal(answer[1], 42);
    });

    it("addValue twice stores the newest value", async () => {
      await list.addValue(accounts[1], 42);
      await list.addValue(accounts[1], 1729);
      let value = await list.get(accounts[1]);
      assert.equal(value, 1729);
    });

    it("addValue with 0 should revert", async () => {
      await expectRevert.unspecified(list.addValue(accounts[1], 0));
    });

    it("addValue absent should emit AddressUpdated", async () => {
      await expectEvent(await list.addValue(accounts[1], 42), 'AddressUpdated', {a: accounts[1], sender: accounts[0]});
    });

    it("addValue absent should return true", async () => {
      let answer = await list.addValue.call(accounts[1], 42);
      assert.equal(answer, true);
    });

    it("addValue present with new value should emit AddressUpdated", async () => {
      await list.addValue(accounts[1], 42);
      await expectEvent(await list.addValue(accounts[1], 1729), 'AddressUpdated', {a: accounts[1], sender: accounts[0]});
    });

    it("addValue present with new value should return true", async () => {
      await list.addValue(accounts[1], 42);
      let answer = await list.addValue.call(accounts[1], 1729);
      assert.equal(answer, true);
    });

    it("addValue duplicate should not emit AddressUpdated", async () => {
      await list.addValue(accounts[1], 42);
      await expectEvent.notEmitted(await list.addValue(accounts[1], 42), 'AddressUpdated');
    });

    it("addValue duplicate should return false", async () => {
      await list.addValue(accounts[1], 42);
      let answer = await list.addValue.call(accounts[1], 42);
      assert.equal(answer, false);
    });

    it("addValue by non-admin should revert", async () => {
      await expectRevert.unspecified(list.addValue(accounts[4], 42, {from: accounts[1]}));
    });
  });

  describe("remove", async () => {
    it("remove present should decrease length", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      await list.remove(accounts[2]);
      let length = await list.length();
      assert.equal(length, 2);
    });

    it("remove absent should not change length", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      await list.remove(accounts[4]);
      let length = await list.length();
      assert.equal(length, 3);
    });

    it("remove present should emit AddressRemoved", async () => {
      await list.add(accounts[1]);
      let tx = await list.remove(accounts[1]);
      await expectEvent(tx, 'AddressRemoved', {a: accounts[1], sender: accounts[0]});
    });

    it("remove present should return true", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      let answer = await list.remove.call(accounts[2]);
      assert.equal(answer, true);
    });

    it("remove absent should not emit AddressRemoved", async () => {
      await list.add(accounts[1]);
      let tx = await list.remove(accounts[2]);
      await expectEvent.notEmitted(tx, 'AddressRemoved');
    });

    it("remove absent should return false", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      await list.remove(accounts[2]);
      let answer = await list.remove.call(accounts[2]);
      assert.equal(answer, false);
      answer = await list.remove.call(accounts[4]);
      assert.equal(answer, false);
    });

    it("remove by non-admin should revert", async () => {
      await list.add(accounts[1]);
      await expectRevert.unspecified(list.remove(accounts[1], {from: accounts[1]}));
    });

    it("after remove, get should return zero", async () => {
      await list.add(accounts[1]);
      await list.add(accounts[2]);
      await list.add(accounts[3]);
      await list.remove(accounts[2]);
      let value = await list.get(accounts[2]);
      assert.equal(value, 0);
    });

  });

});
