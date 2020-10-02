
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import './interfaces/IAddressListFactory.sol';
import './AddressList.sol';

contract AddressListFactory is IAddressListFactory {
    address[] private allLists;

    constructor() public {
    }

    function listCount() external override view returns (uint) {
        return allLists.length;
    }

    function listAt(uint idx) external override view returns (address) {
        require(idx < allLists.length);
        return allLists[idx];
    }

    function createList() external override returns (address listaddr) {
        listaddr = address(new AddressList(msg.sender));
        allLists.push(listaddr);
        emit ListCreated(msg.sender, listaddr);
    }
}
