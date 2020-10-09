// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

interface IAddressList {
    event AddressUpdated(address indexed a, address indexed sender);
    event AddressRemoved(address indexed a, address indexed sender);

    function add(address a) external returns (bool);
    function addValue(address a, uint256 v) external returns (bool);
    function remove(address a) external returns (bool);

    function get(address a) external view returns (uint256);
    function at(uint256 index) external view returns (address, uint256);
    function length() external view returns (uint256);
}
