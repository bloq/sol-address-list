
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import '@openzeppelin/contracts/access/AccessControl.sol';
import './interfaces/IAddressList.sol';
import './EnumerableMap.sol';

contract AddressList is AccessControl, IAddressList {
    using EnumerableMap for EnumerableMap.AddressToUintMap;
    EnumerableMap.AddressToUintMap private theList;

    bytes32 public constant LIST_ADMIN = keccak256("LIST_ADMIN");

    // initialize owner and list-admin roles
    constructor(address owner) public {
        _setupRole(DEFAULT_ADMIN_ROLE, owner);
        _setupRole(LIST_ADMIN, owner);
    }

    ///////////////////////////////////////////////////////////////

    // Anyone: query list entry at index N (no ordering guarantees)
    function at(uint256 index) external view override returns (address, uint256) {
        return theList.at(index);
    }

    // Anyone: total list length
    function length() external view override returns (uint256) {
        return theList.length();
    }

    // Anyone: query value associated with address.  returns zero if absent.
    function get(address a) external view override returns (uint256) {
        return theList.get(a);
    }

    ///////////////////////////////////////////////////////////////

    // Admin: add (address,1) to list
    function add(address a) external override returns (bool) {
        require(hasRole(LIST_ADMIN, msg.sender));
        return _add(a, 1);
    }

    // Admin: add (address, n) to list
    function addValue(address a, uint256 v) external override returns (bool) {
        require(hasRole(LIST_ADMIN, msg.sender));
        return _add(a, v);
    }

    // Admin: remove address from list
    function remove(address a) external override returns (bool) {
        require(hasRole(LIST_ADMIN, msg.sender));
        return _remove(a);
    }

    ///////////////////////////////////////////////////////////////

    function _add(address a, uint256 v) private returns (bool) {
        require(v != 0);
        if (theList.get(a) != v) {
            theList.set(a, v);
            emit AddressUpdated(a, msg.sender);
            return true;
        }

        return false;
    }

    function _remove(address a) private returns (bool) {
        bool removed = theList.remove(a);
        if (removed) {
            emit AddressRemoved(a, msg.sender);
            return true;
        }

        return false;
    }
}
