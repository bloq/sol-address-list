
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import './interfaces/IAddressListFactory.sol';
import './AddressList.sol';

contract AddressListFactory is IAddressListFactory {
    address[] private allLists;
    mapping(address => bool) private isOurs;

    constructor() public {
    }

    function ours(address a) external override view returns (bool) {
        return isOurs[a];
    }

    function listCount() external override view returns (uint) {
        return allLists.length;
    }

    function listAt(uint idx) external override view returns (address) {
        require(idx < allLists.length, "Index exceeds list length");
        return allLists[idx];
    }

    function createList() external override returns (address listaddr) {
        // create new address list contract
        listaddr = address(new AddressList(msg.sender));

        // note our creation
        allLists.push(listaddr);
        isOurs[listaddr] = true;

        // log our creation
        emit ListCreated(msg.sender, listaddr);
    }
}
